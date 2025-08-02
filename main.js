const { app, BrowserWindow, session } = require('electron');
const { ElectronBlocker } = require('@ghostery/adblocker-electron');
const fetch = require('cross-fetch');
const path = require('path');

let mainWin;

function createWindow() {
  mainWin = new BrowserWindow({
    width: 1100,
    height: 750,
    icon: path.join(__dirname, 'static/img/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
    },
    frame: null,
  });

  mainWin.loadFile('index.html');
  mainWin.setMinimumSize(420, 400);
  mainWin.maximize();
}

app.whenReady().then( async () => {
  try {
      const blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);
      blocker.enableBlockingInSession(session.defaultSession);
  } catch {
      console.log('\x1b[31m%s\x1b[0m', 'Cannot load adblocker module');
  }

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});