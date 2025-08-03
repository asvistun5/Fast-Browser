        const { remote, session } = require('electron');
        const webview = document.getElementById('webview');
        const urlInput = document.getElementById('url-input');
        const doc = document;

        doc.getElementById('settings-btn').addEventListener('click', () => {
            doc.querySelector('.settings').classList.toggle('show');
        });

        document.getElementById('back-btn').onclick = () => {
            if (webview.canGoBack()) webview.goBack();
        };
        document.getElementById('forward-btn').onclick = () => {
            if (webview.canGoForward()) webview.goForward();
        };
        document.getElementById('refresh-btn').onclick = () => {
            webview.reload();
        };

        webview.addEventListener('did-finish-load', () => {
            const title = webview.getTitle();
            doc.title = `${title} - Fast`;
        });

        webview.addEventListener("did-fail-load", event => {
            const errorPage = `file://${__dirname}/templates/error.html` +
                `?code=${encodeURIComponent(event.errorCode)}` +
                `&desc=${encodeURIComponent(event.errorDescription)}` +
                `&url=${encodeURIComponent(event.validatedURL)}` +
                `&home=templates/error.html`;

            webview.src = errorPage;
        });

        urlInput.addEventListener('change', (e) => {
            let url = e.target.value.trim();
            if (!url.startsWith('http')) url = 'https://' + url;
            webview.loadURL(url);
        });

        webview.addEventListener('did-navigate', (event) => {
            const currentUrl = event.url;
            urlInput.value = currentUrl;
            document.getElementById('back-btn').disabled = !webview.canGoBack();
            document.getElementById('forward-btn').disabled = !webview.canGoForward();
        });

        document.getElementById('settings-btn').onclick = () => {
            document.querySelector('.settings').classList.toggle('show');
        };

        document.getElementById('incognito-btn').onclick = () => {
            const incog = session.fromPartition(`persist:incognito-${Date.now()}`);
            webview.loadURL('https://www.google.com', { session: incog });
        };

        let jsEnabled = true;
        document.getElementById('toggle-js-btn').onclick = () => {
            jsEnabled = !jsEnabled;
            const prefs = webview.getWebPreferences();
            prefs.javascript = jsEnabled;
            webview.reload();
        };

        document.getElementById('clear-ls-btn').onclick = () => {
            webview.executeJavaScript('localStorage.clear(); location.reload();');
        };

        document.getElementById('clear-cookies-btn').onclick = async () => {
            const s = remote.session.defaultSession;
            const cookies = await s.cookies.get({});
            for (const c of cookies) {
                const url = `${c.secure ? 'https' : 'http'}://${c.domain.startsWith('.') ? c.domain.slice(1) : c.domain}${c.path}`;
                await s.cookies.remove(url, c.name);
            }
            webview.reload();
        };