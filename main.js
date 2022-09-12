const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { initialize, enable } = require("@electron/remote/main");
const path = require('path')
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const isDev = require('electron-is-dev');

const Store = require("electron-store");
const filesStore = new Store({ name: "FilesData" });

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
}

const options = {
    loadExtensionOptions: { allowFileAccess: true },
}

async function getPathName(title) {
    return await app.getPath(title);
}

app.whenReady().then(() => {
    Store.initRenderer()
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    // ipc message
    // get path name
    ipcMain.handle(ipcTypes.GET_PATH_NAME, async (e, title) => getPathName(title));

    ipcMain.handle(ipcTypes.OPEN_DIALOG, (e) => {
        return dialog.showOpenDialog({
            title: "选择导入的markdown",
            properties: ["openFile", "multiSelections"],
            filters: [
                {
                    name: "markdown files",
                    extensions: ["md"],
                },
            ],
        })
    });

    ipcMain.handle(ipcTypes.IMPORT_MESSAGE, (e, num) => {
        return dialog.showMessageBox({
            type: "info",
            title: "文件导入成功",
            message: `成功导入了${num}个文件`
        })
    });

    ipcMain.handle(ipcTypes.IMPORT_ERROR, (e) => {
        return dialog.showErrorBox("导入错误", "导入错误，请查看路径或已导入文件")
    })

})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})