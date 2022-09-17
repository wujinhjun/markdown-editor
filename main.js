const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const { initialize, enable } = require("@electron/remote/main");
const path = require('path')
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const isDev = require('electron-is-dev');

const Store = require("electron-store");

const ipcTypes = require("./ipcTypes")
const AppWindow = require("./AppWindow/AppWindow");
let templateMenu = require("./templates");
let mainWindow, settingWindow;

const showContextMenu = (event) => {
    const template = [
        {
            label: "打开",
            click: () => {
                mainWindow.webContents.send(ipcTypes.OPEN_FILE);
            }
        },
        {
            label: "重命名",
            click: () => {
                mainWindow.webContents.send(ipcTypes.RENAME_FILE);
            }
        },
        {
            label: "删除",
            click: () => {
                mainWindow.webContents.send(ipcTypes.DELETE_FILE);
            }
        },
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup(BrowserWindow.fromWebContents(event.sender));
}

const createWindow = () => {

    const mainWindowConfig = {
        width: 1200,
        height: 800,
        minWidth: 1076,
        minHeight: 680,
        webPreferences: {
            nodeIntegration: true,
            preload: isDev ? path.join(__dirname, 'preload.js') : path.join(__dirname, "../preload.js")
        },
    }

    // 加载 index.html
    const urlLocation = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, './index.html')}`;
    mainWindow = new AppWindow(mainWindowConfig, urlLocation);
    mainWindow.loadURL(urlLocation);

    mainWindow.on("closed", () => {
        mainWindow = null;
    })

    initialize();
    enable(mainWindow.webContents);

    // 打开开发工具
    // mainWindow.webContents.openDevTools()
    // installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], options)
    //     .then((name) => console.log(`Added Extension: ${name}`))
    //     .catch((err) => console.log('An error occurred: ', err));
    // let menu = Menu.buildFromTemplate(template);
    // Menu.setApplicationMenu(menu);

    // conceal menu
    // // mainWindow.removeMenu();

    // 加载菜单

    let menu = Menu.buildFromTemplate(templateMenu)
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

    ipcMain.on(ipcTypes.OPEN_SETTING_WINDOW, () => {
        const settingWindowConfig = {
            width: 600,
            height: 400,
            parent: mainWindow,
            webPreferences: {
                nodeIntegration: true,
                preload: isDev ? path.join(__dirname, 'preload.js') : path.join(__dirname, "../preload.js")
            }
        }

        const settingsFileLocation = `file://${path.join(__dirname, "./settings/index.html")}`;
        settingWindow = new AppWindow(settingWindowConfig, settingsFileLocation);
        settingWindow.on("closed", () => {
            settingWindow = null;
        })
        settingWindow.webContents.openDevTools()
        enable(settingWindow.webContents)
    })

    ipcMain.handle(ipcTypes.OPEN_LOCATION_DIALOG, () => {
        return dialog.showOpenDialog({
            properties: ["openDirectory"],
            message: "选择文件的存储路径"
        })
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