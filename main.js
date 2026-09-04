import { createWindow, startApp } from './src/browser/window.js';


startApp(() => createWindow(), (ipc, win) => {
    ipc.on('wim:m', e => {
        win.minimize();
    });
});