const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    min() {
        ipcRenderer.send('minimize');
    },
    max() {
        ipcRenderer.send('maximize');
    },
    close() {
        ipcRenderer.send('close');
    },
});