const { app, BrowserWindow, ipcMain } = require('electron')
const { initialize, enable } = require("@electron/remote/main");
const path = require('path')
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const isDev = require('electron-is-dev');

const ipcTypes = require("./ipcTypes")


const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1076,
        minHeight: 680,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // sandbox: false,
            nodeIntegration: true
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
    // // mainWindow.removeMenu();

    // ipc message
    // get path name
    // ipcMain.on(
    //     ipcTypes.GET_PATH_NAME,
    //     (e, title) => {
    //         const pathName = app.getPath(title);
    //         console.log(pathName);
    //         mainWindow.webContents.send(ipcTypes.RETURN_PATH_NAME, pathName);
    //     })

}

const options = {
    loadExtensionOptions: { allowFileAccess: true },
}

async function getPathName(title) {
    return await app.getPath(title);
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    // ipc message
    // get path name
    ipcMain.handle(ipcTypes.GET_PATH_NAME, async (e, title) => getPathName(title));

})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})