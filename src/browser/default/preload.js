const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    min() {
        ipcRenderer.send('win:min');
    },
    max() {
        ipcRenderer.invoke('win:max');
    },
    close() {
        ipcRenderer.send('win:close');
    },
});