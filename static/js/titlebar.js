const titlebar = document.querySelector('.titlebar');

window.addEventListener('focus', () => {
    titlebar.style.backgroundColor = 'var(--titlebar-light-bg-hover-c)';
});

window.addEventListener('blur', () => {
    titlebar.style.backgroundColor = 'var(--titlebar-light-bg-c)';
});