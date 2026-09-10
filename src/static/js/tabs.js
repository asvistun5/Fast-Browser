import { browser } from './data.js';

export const manager = {
    views: 1,
    activeTab: $(browser.tabs, '.tab-btn'),
    active: browser.view,
    tabs: [],

    push(id, tab, view) {
        this.tabs.push([id, tab, view, view.getURL()]);
    },

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

        const id = views + 1;
        newTab.setAttribute('data-tab', id);

        active.hide();

        const newView = elem(
            `<webview src="https://www.google.com" useragent="${browser.agent}" partition="persist:guest" preload="browser/view/preload.js"></webview>`,
        );

        newView.on('page-title-updated', e => {
            newTab.textContent = e.title.slice(0, 15) + (e.title.length > 15 ? '...' : '');
        });

        this.updateTab(newTab, newView);

        addTab.before(newTab);
        main.appendChild(newView);

        views++;
        activeTab = newTab;
        active = newView;
        this.push(id, newTab, newView);
    }
};

let { activeTab, active } = manager;
const { addTab, tabs } = browser;

manager.push(1, activeTab, active);

tabs.on('click', e => {
    const tg = e.target;
    const close = sel => tg.closest(sel);
    const tab = close('.tab-btn');

    if (tab) {
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