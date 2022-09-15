const { BrowserWindow } = require("electron");
const path = require("path");

class AppWindow extends BrowserWindow {
    constructor(config, urlLocation) {
        const basicConfig = {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js')
            },
            show: false,
            backgroundColor: "#efefef"
        }

        const finalConfig = { ...basicConfig, ...config }
        super(finalConfig);
        this.loadURL(urlLocation);
        this.once("ready-to-show", () => {
            this.show()
        })
    }
}

module.exports = AppWindow;