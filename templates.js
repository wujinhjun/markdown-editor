const ipcTypes = require("./ipcTypes");

let template = [
    {
        label: "文件",
        submenu: [
            // {
            //     label: "",
            //     accelerator: "",
            //     click: () => { }
            // },
            {
                label: "保存",
                accelerator: "CmdOrCtrl+S",
                click: (menuItem, browserWindow, event) => {
                    // console.log(ipcTypes.SAVE_EDIT_FILE);
                    // console.log(browserWindow);
                    browserWindow.send(ipcTypes.SAVE_EDIT_FILE);
                }
            }
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