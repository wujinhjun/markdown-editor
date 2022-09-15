const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const { initialize, enable } = require("@electron/remote/main");
const path = require('path')
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const isDev = require('electron-is-dev');

const Store = require("electron-store");
const filesStore = new Store({ name: "FilesData" });

const ipcTypes = require("./ipcTypes")
let template = require("./templates");
let mainWindow;

const showContextMenu = (event) => {
    const template = [
        {
            label: "重命名",
            click: () => {
                mainWindow.webContents.send(ipcTypes.RENAME_FILE);
            }
        },
        { type: "separator" },
        {
            label: "删除",
            click: () => {

            }
        },
        { type: "separator" },
    ];
    const menu = Menu.buildFromTemplate(template);
    console.log("menu");
    menu.popup(BrowserWindow.fromWebContents(event.sender));
}

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1076,
        minHeight: 680,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
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
    // let menu = Menu.buildFromTemplate(template);
    // Menu.setApplicationMenu(menu);

    // conceal menu
    // // mainWindow.removeMenu();

    // 加载菜单

    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

const options = {
    loadExtensionOptions: { allowFileAccess: true },
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
    ipcMain.handle(ipcTypes.GET_PATH_NAME, async (_e, title) => await app.getPath(title));

    ipcMain.handle(ipcTypes.OPEN_DIALOG, (_e) => {
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

    ipcMain.handle(ipcTypes.IMPORT_MESSAGE, (_e, num) => {
        return dialog.showMessageBox({
            type: "info",
            title: "文件导入成功",
            message: `成功导入了${num}个文件`
        })
    });

    ipcMain.handle(ipcTypes.IMPORT_ERROR, (_e) => {
        return dialog.showErrorBox("导入错误", "导入错误，请查看路径或已导入文件")
    })

    ipcMain.handle(ipcTypes.OPEN_CONTEXT_MENU, (_e) => { return showContextMenu(_e) })

})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})