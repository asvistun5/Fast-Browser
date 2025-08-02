const webview = document.getElementById('webview');

// Данные для контекстного меню
const menuItems = [
    {
        label: 'Custom Action',
        click: () => {
            console.log('Custom action triggered');
        }
    },
    {
        label: 'Another Action',
        click: () => {
            console.log('Another action triggered');
        }
    }
];

// Обработчик для контекстного меню на webview
webview.addEventListener('context-menu', (e) => {
    e.preventDefault(); // предотвращаем стандартное контекстное меню
    window.electron.showContextMenu(menuItems); // Отправляем запрос на показ меню
});