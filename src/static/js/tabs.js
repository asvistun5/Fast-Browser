const manager = {
    views: 1,
    activeTab: $(browser.tabs, '.tab-btn'),
    active: browser.view,
    tabs: [
        [$(browser.tabs, '.tab-btn'), browser.view]
    ],
    updateTab(tab, view) {
        view.on('page-title-updated', e => {
            tab.textContent = e.title.slice(0, 15) + (e.title.length > 15 ? '...' : '');
        });

        const updateUrl = () => {
            if (this.active === view) {
                urlInput.value = view.getURL();
            }
        };

        view.on('did-navigate', updateUrl);
        view.on('did-navigate-in-page', updateUrl);
    },
    createNewTab() {
        let { views, activeTab, active } = manager;
        const { addTab, tabs, main } = browser;

        const newTab = activeTab.clone();
        newTab.textContent = 'New Tab';

        active.hide();

        const newView = elem(`<webview src="https://www.google.com" useragent="${browser.agent}" partition="persist:guest" preload="browser/view/preload.js"></webview>`);

        newView.on('page-title-updated', e => {
            newTab.textContent = e.title.slice(0, 15) + (e.title.length > 15 ? '...' : '');
        });

        this.updateTab(newTab, newView);

        addTab.before(newTab);
        main.appendChild(newView);

        views++;
        activeTab = newTab;
        active = newView;
        this.tabs.push([newTab, newView]);
    }
};


!function() {
    let { activeTab, active } = manager;
    const { addTab, tabs } = browser;

    tabs.on('click', e => {
        const tg = e.target;
        const close = sel => tg.closest(sel);

        if (close('.tab-btn')) {
            const tab = close('.tab-btn');
            const view = manager.tabs.find(([t, v]) => t === tab)[1];
            view.show();
            active.hide();
            active = view;
        }
    });

    addTab.on('click', () => {
        manager.createNewTab();
    });

    active.on('page-title-updated', e => {
        activeTab.textContent = e.title.slice(0, 15) + (e.title.length > 15 ? '...' : '');
    });
}();