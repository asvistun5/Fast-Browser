function playRipple(trg, event) {
    const ripple = document.createElement('span');
    const rect = trg.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    ripple.classList.add('ripple-effect');
    trg.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

document.addEventListener('mousedown', e => {
    const button = e.target.closest('.ripple');

    if (button) playRipple(button, e);
});