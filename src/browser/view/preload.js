const { ipcRenderer } = require('electron');


window.addEventListener('contextmenu', e => {
    e.preventDefault();
    
    const coords = { x: e.clientX, y: e.clientY };

    ipcRenderer.sendToHost('context', { coords });
});


window.addEventListener('click', e => {
    ipcRenderer.sendToHost('click');
});