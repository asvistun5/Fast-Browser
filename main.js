import { createWindow, startApp } from './src/browser/window.js';


startApp(() => createWindow(), (ipc, win) => {
    ipc.on('win:new', e => {
        createWindow();
    });
});