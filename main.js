const { app, BrowserWindow } = require('electron')
const { initialize, enable } = require("@electron/remote/main");
const path = require('path')
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const isDev = require('electron-is-dev');


const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1040,
        height: 680,
        minWidth: 1040,
        minHeight: 680,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    // 加载 index.html
    const urlLocation = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, './index.html')}`;
    mainWindow.loadURL(urlLocation)
    initialize();
    enable(mainWindow.webContents);

    // 打开开发工具
    mainWindow.webContents.openDevTools()
    installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], options)
        .then((name) => console.log(`Added Extension: ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

    // conceal menu
    // mainWindow.removeMenu();
}

const options = {
    loadExtensionOptions: { allowFileAccess: true },
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})