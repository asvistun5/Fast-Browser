import { browser } from './data.js';

let menu = null;

export function ContextMenu(e, btns = ['Cut', 'Copy', 'Paste'], callback = () => {}) {
    if (menu) {
        menu.innerHTML = btns.map(btn => {
            const name = typeof btn === 'string' ? btn === '-' ? '<hr>' : btn : btn.name;
            const disabled = typeof btn === 'object' && btn.disabled;

            const html = name === '<hr>' ? '<hr>' : `<button
                class="${name.toLowerCase()}-btn"
                ${disabled ? 'disabled' : ''}
            >${name}</button>`;

            return html;
        }).join('');
    } else {
        menu = elem(`
            <div class="context-menu">
                ${btns.map(btn => {
                    const name = typeof btn === 'string' ? btn === '-' ? '<hr>' : btn : btn.name;
                    const disabled = typeof btn === 'object' && btn.disabled;

                    const html = name === '<hr>' ? '<hr>' : `<button
                        class="${name.toLowerCase()}-btn"
                        ${disabled ? 'disabled' : ''}
                    >${name}</button>`;
                }).join('')}
            </div>
        `);

        dom.body.appendChild(menu);
    }

    if (typeof e === 'object' && e !== null) {
        menu.style.left = `${e.x}px`;
        menu.style.top = `${e.y}px`;
    } else {
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
    }

    const show = () => menu.classList.add('show');
    const hide = () => menu.classList.remove('show');

    menu.show = show;
    menu.hide = hide;

    const cut = () => {
        const selection = window.getSelection();
        const range = document.createRange();

        range.selectNodeContents(menu);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('cut');
        selection.removeAllRanges();
    }

    const copy = () => {
        const selection = window.getSelection();
        const range = document.createRange();

        range.selectNodeContents(menu);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
    }

    const paste = () => {
        navigator.clipboard.readText().then(text => {
            callback('Paste', text);
        });
    }

    menu.addEventListener('click', e => {
        const tg = e.target;
        const close = sel => tg.closest(sel);

        if (close('.cut-btn')) {
            cut();
        } else if (close('.copy-btn')) {
            copy();
        } else if (close('.paste-btn')) {
            paste();
        } else if (close('button')) {
            callback(tg.textContent.toLowerCase());
        }
    });

    return menu;
}

dom.body.addEventListener('contextmenu', e => {
    e.preventDefault();

    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        menu = ContextMenu(e);
        menu.show();
    }
});

dom.addEventListener('click', e => {
    menu.hide();
});

webview.addEventListener('ipc-message', e => {
    if (e.channel === 'context') {
        const data = e.args[0];

        const rect = webview.getBoundingClientRect();

        const x = rect.left + data.coords.x;
        const y = rect.top + data.coords.y;
        const type = data.type;

        let listBtn;

        if (type === 'input') {
            listBtn = ['Cut', 'Copy', 'Paste', '-', { name: 'Inspect' }];
        } else {
            listBtn = [{ name: 'Back', disabled: !webview.canGoBack() }, { name: 'Forward', disabled: !webview.canGoForward() }, { name: 'Reload' }, '-', { name: 'Inspect' }];
        }

        menu = ContextMenu(
            { x, y },
            listBtn,
            btn => {
                if (btn === 'back') {
                    webview.goBack();
                } else if (btn === 'forward') {
                    webview.goForward();
                } else if (btn === 'reload') {
                    webview.reload();
                } else if (btn === 'inspect') {
                    webview.openDevTools();
                }
            }
        );

        menu.show();
    } else if (e.channel === 'click') {
        menu.classList.remove('show');
    }
});