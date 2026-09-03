import { createWindow, startApp } from './src/browser/window.js';


startApp(() => { createWindow() }, (ipc, win) => {
    ipc.on('minimize', e => {
        win.minimize();
    });

    ipc.on('maximize', e => {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });

    ipc.on('close', e => {
        win.close();
    });
});