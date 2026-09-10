import { app, BrowserWindow, ipcMain } from 'electron';
import { setupBlocker } from '../security/block.js';

import dotenv from 'dotenv';
import { find } from './utils.js';

import { getBlinkMemoryInfo } from 'process';
import { isBigIntObject } from 'util/types';

dotenv.config();

const debug = process.env.DEVTOOLS === 'true';


export function createWindow({ url, icon, preload } = {}) {
    const ico = icon ? find(icon) : find('..', 'static', 'img', 'icon.png');
    const pre = preload ? find(preload) : find('default', 'preload.js');

    const win = new BrowserWindow({
        width: 1100,
        height: 800,
        icon: ico,
        frame: false,
        autoHideMenuBar: true,
        webPreferences: {
            webviewTag: true,
            webSecurity: true,
            backgroundThrottling: true,
            contextIsolation: true,
            nodeIntegration: false,
            preload: pre,
        }
    });

    win.setMenu(null);
    win.setMinimumSize(1100, 750);

    if (url) {
        win.loadURL(url);
    } else {
        win.loadFile(find('..', 'index.html'));
    }

    if (debug) win.webContents.openDevTools();

    /*win.on('minimize', () => {
        win.loadURL('about:blank');
    });

    win.on('restore', () => {
        win.loadFile(find('..', 'index.html'));
    });*/

    ipcMain.on('win:min', e => {
        win.minimize();
    });

    ipcMain.handle('win:max', e => {
        const isMax = win.isMaximized();

        isMax ? win.unmaximize() : win.maximize();

        return isMax;
    });

    ipcMain.on('win:close', e => {
        win.close();
    });

    return win;
}

export function startApp(start, controller) {
    app.setName('Noct');
    app.whenReady().then(async () => {
        await setupBlocker();

        const win = start();
        controller(ipcMain, win);
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) start();
    });

    app.commandLine.appendSwitch('disable-background-timer-throttling');
    app.commandLine.appendSwitch('disable-renderer-backgrounding');
    app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
}