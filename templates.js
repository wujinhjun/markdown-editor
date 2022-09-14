const ipcTypes = require("./ipcTypes");

let template = [
    {
        label: "文件",
        submenu: [
            {
                label: "新建",
                accelerator: "CmdOrCtrl+N",
                click: (menuItem, browserWindow, event) => {
                    browserWindow.send(ipcTypes.CREATE_NEW_FILE);
                }
            },
            {
                label: "保存",
                accelerator: "CmdOrCtrl+S",
                click: (menuItem, browserWindow, event) => {
                    browserWindow.send(ipcTypes.SAVE_EDIT_FILE);
                }
            },
            {
                label: "搜索",
                accelerator: "CmdOrCtrl+F",
                click: (menuItem, browserWindow, event) => {
                    browserWindow.send(ipcTypes.SEARCH_FILE);
                }
            },
            {
                label: "导入",
                accelerator: "CmdOrCtrl+O",
                click: (menuItem, browserWindow, event) => {
                    browserWindow.send(ipcTypes.IMPORT_FILE);
                }
            },
            {
                label: "关闭",
                accelerator: "CmdOrCtrl+W",
                click: (menuItem, browserWindow, event) => {
                    browserWindow.send(ipcTypes.CLOSE_FILE);
                }
            },
        ]
    },
    {
        label: "视图",
        submenu: [
            {
                label: "刷新",
                accelerator: "CmdOrCtrl+R",
                click: (item, focusedWindow) => {
                    if (focusedWindow) {
                        focusedWindow.reload();
                    }
                }
            },

        ]
    },
]

module.exports = template;