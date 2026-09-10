export const browser = {
    view: $('webview'),
    field: $('.searchbox input'),
    tabs: $('.tabs-list'),
    main: $('main'),
    addTab: $('.add-tab-btn'),
    menu: $('.context-menu'),
    agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36',

    setURL(url, load = true) {
        let display;
        url = url.trim();

        if (!url.includes('://')) {
            display = url;
            url = 'https://' + url;
        } else {
            display = url.trim().split('://')[1];
        }

        if (display.startsWith('www.')) {
            display = display.endsWith('/') ? display.slice(4, -1) : display.slice(4);
        }

        this.field.value = display;

        if (load)
            this.view.loadURL(url) 
        else
            return display;
    }
}