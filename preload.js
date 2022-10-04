const { contextBridge, ipcRenderer } = require("electron");
const { join, dirname, basename, extname } = require("path");
const fs = require("node:fs/promises");
const Store = require("electron-store");

const filesStore = new Store({ name: "FilesData" })
const settingStore = new Store({ name: "SettingConfig" })
const ipcTypes = require("./ipcTypes");

const tranObjToArr = objList => Object.keys(objList).map((item) => (objList[item]))

contextBridge.exposeInMainWorld("myApp", {
    readFile: (path) => {
        return fs.readFile(path, { encoding: "utf-8" });
    },

    writeFile: (path, content) => {
        return fs.writeFile(path, content, { encoding: "utf-8" })
    },

    renameFile: (path, newPath) => {
        return fs.rename(path, newPath);
    },

    deleteFile: (path) => {
        return fs.unlink(path);
    },

    joinPath: (path, title) => join(path, `${title}.md`),

    dirPath: (path) => dirname(path),

    basePath: (path) => basename(path, extname(path)),

    getPath: (title) => ipcRenderer.invoke(ipcTypes.GET_PATH_NAME, title),

    getFilesData: () => filesStore.get("files"),

    saveFilesData: (files) => {
        const filesStoreObj = tranObjToArr(files).reduce((result, file) => {
            const { id, path, title } = file;
            result[id] = {
                id,
                path,
                title
            };
            return result;
        }, {});
        filesStore.set("files", filesStoreObj);
        return;
    },

    showImportDialog: () => ipcRenderer.invoke(ipcTypes.OPEN_DIALOG),

    showMessageBox: (num) => ipcRenderer.invoke(ipcTypes.IMPORT_MESSAGE, num),

    showErrorBox: () => ipcRenderer.invoke(ipcTypes.IMPORT_ERROR),

    openSettingWindowIPC: () => ipcRenderer.send(ipcTypes.OPEN_SETTING_WINDOW),
    listenIPC: (key, cb) => ipcRenderer.on(key, cb),
    removeListenIPC: (key, cb) => ipcRenderer.removeListener(key, cb),

    openContextDialog: () => ipcRenderer.invoke(ipcTypes.OPEN_CONTEXT_MENU),

    // self saved location
    getSavedPath: () => settingStore.get("savedLocation"),

    // setting window
    openSettingDialog: () => ipcRenderer.invoke(ipcTypes.OPEN_LOCATION_DIALOG),
    saveSettingPath: (path) => settingStore.set("savedLocation", path),

    // more details
    showSaveBox: () => ipcRenderer.invoke(ipcTypes.SAVE_EDIT_FILE),
    showRenameErrorBox: () => ipcRenderer.invoke(ipcTypes.RENAME_ERROR),
})
