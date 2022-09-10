const { contextBridge, ipcRenderer, app } = require("electron");
// const app = require("@electron/remote").app;
const ipcTypes = require("./ipcTypes");


// contextBridge.exposeInMainWorld("file", {
//     setTitle: (title) => ipcRenderer.send('set-title', title)
// })

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
        // ipcRenderer.on(ipcTypes.RETURN_PATH_NAME, (e, mes) => {
        //     console.log(mes);
        //     // res = mes;
        // })
        // return res;
    )
    // getPath: () => {
    //     return app.getPath("documents");
    // }
})