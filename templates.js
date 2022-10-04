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
        label: "编辑",
        submenu: [
            {
                label: '撤销',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            {
                label: '重做',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: '剪切',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: '复制',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: '粘贴',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: '全选',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            }
        ]
    },
    {
        label: "软件设置",
        submenu: [
            {
                label: "设置",
                accelerator: "CmdOrCtrl+,",
                click: (menuItem, browserWindow, event) => {
                    browserWindow.send(ipcTypes.OPEN_SETTING_WINDOW);
                }
            },
            {
                label: '刷新',
                accelerator: 'CmdOrCtrl+R',
                click: (item, focusedWindow) => {
                    if (focusedWindow)
                        focusedWindow.reload();
                }
            },

        ]
    },
]

module.exports = template;