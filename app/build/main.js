"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const deviceContext_1 = require("./core/deviceContext");
const rfcommProvider_1 = require("./spork/src/devices/spark/rfcommProvider");
const sendMessageToApp = (type, msg) => {
    if (win) {
        // send message to be handled by the UI/app (appViewModel)
        win.webContents.send(type, msg);
    }
};
const deviceContext = new deviceContext_1.DeviceContext();
deviceContext.init(new rfcommProvider_1.RfcommProvider(), sendMessageToApp);
let win;
try {
    require('electron-reloader')(module);
}
catch (_) { }
if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    electron_1.app.quit();
}
else {
    // perform update check and start app normally
    initApp();
    setTimeout(() => {
        require('update-electron-app')();
    }, 10000);
}
function initApp() {
    electron_1.ipcMain.handle('perform-action', (event, args) => {
        // ... do hardware actions on behalf of the Renderer
        deviceContext.performAction(args);
    });
    electron_1.app.whenReady().then(() => {
        createWindow();
    });
    electron_1.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
}
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1280,
        height: 860,
        icon: "./images/icon/favicon.ico",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    });
    if (electron_1.app.isPackaged) {
        win.removeMenu();
    }
    win.loadFile('index.html');
}
// handle squirrel installer events
function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }
    const ChildProcess = require('child_process');
    const path = require('path');
    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);
    const spawn = function (command, args) {
        let spawnedProcess, error;
        try {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
        }
        catch (error) { }
        return spawnedProcess;
    };
    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };
    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus
            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);
            setTimeout(electron_1.app.quit, 1000);
            return true;
        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers
            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);
            setTimeout(electron_1.app.quit, 1000);
            return true;
        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated
            electron_1.app.quit();
            return true;
    }
}
;
//# sourceMappingURL=main.js.map