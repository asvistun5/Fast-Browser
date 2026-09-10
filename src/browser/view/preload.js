const { ipcRenderer } = require('electron');


window.addEventListener('contextmenu', e => {
    e.preventDefault();
    let type = e.target.tagName.toLowerCase();

    type = type === 'input' || type === 'textarea' ? 'input' : type;
    
    const coords = { x: e.clientX, y: e.clientY };

    ipcRenderer.sendToHost('context', { coords, type });
});


window.addEventListener('click', e => {
    ipcRenderer.sendToHost('click');
});