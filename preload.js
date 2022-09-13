// import { tranObjToArr } from "./src/utils/Helpers";

const { contextBridge, ipcRenderer } = require("electron");
const { join, dirname, basename, extname } = require("path");
const fs = require("node:fs/promises");
const Store = require("electron-store");

const filesStore = new Store({ name: "FilesData" })
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

    // saveEditFile: (callback) => ipcRenderer.on(ipcTypes.SAVE_EDIT_FILE, callback),
    listenIPC: (key, cb) => {
        // console.log(key);

        return ipcRenderer.on(key, cb)
    },
    removeListenIPC: (key, cb) => ipcRenderer.removeListener(key, cb),

})
