function ContextMenu(btns) {
    let menu = $('.context-menu');

    if (menu) {
        menu.innerHTML = btns.map(btn => `<button>${btn}</button>`).join('');
    } else {
        menu = elem(`<div class="context-menu">${btns.map(btn => `<button>${btn}</button>`).join('')}</div>`);
        dom.body.appendChild(menu);
    }
}

dom.body.addEventListener("contextmenu", e => {
    e.preventDefault();
});