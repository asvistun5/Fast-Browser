const { ipcRenderer } = require('electron');
const contextMenu = document.querySelector('.context-menu');
const urlInputField = document.getElementById('url-input');


function addMenuListener(target, actions = ['Copy', 'Paste']) {
    target.addEventListener('contextmenu', e => {
        e.preventDefault();

        contextMenu.innerHTML = '';

        actions.forEach(action => {
            const actionName = action.toLowerCase();

            if (actionName == 'hr') {
                const hr = document.createElement('hr');
                contextMenu.appendChild(hr);

            } else {
                const act = document.createElement('button');

                act.textContent = action;
                act.id = `menu-${action.toLowerCase()}-btn`;

                act.addEventListener('click', () => {
                    if (actionName == 'emoji') {
                        ipcRenderer.send('triggerEmojiBtn');
                    }
                    contextMenu.classList.remove('show');
                });
                contextMenu.appendChild(act);
            }
        });

        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;

        contextMenu.classList.add('show');
    });
}


document.addEventListener('click', e => {
    if (!contextMenu.contains(e.target)) {
        contextMenu.classList.remove('show');
    }
});


addMenuListener(urlInputField, ['Emoji', 'hr', 'Cancel', 'hr', 'Copy', 'Paste', 'hr', 'Select All', 'hr', 'Always show full url'])