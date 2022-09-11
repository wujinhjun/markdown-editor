const { contextBridge, ipcRenderer, app } = require("electron");
// const app = require("@electron/remote").app;
const ipcTypes = require("./ipcTypes");

contextBridge.exposeInMainWorld("myApp", {
    getPath: (title) => (
        ipcRenderer.invoke(ipcTypes.GET_PATH_NAME, title)
            .then((res) => {
                // console.log(res);
                return res;
            })
            .catch((err) => {
                // console.log(err);
                return err;
            })
    )
})