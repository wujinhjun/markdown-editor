// const fs = window.require('node:fs/promises');
// const path = window.require("path");
const fileDealer = {
    readFile: (path) => {
        // console.log(path);
        // return fs.readFile(path, { encoding: 'utf-8' });
        return window.myApp.readFile(path);
    },

    writeFile: (path, content) => {
        // console.log(path);
        // return fs.writeFile(path, content, { encoding: 'utf-8' });
        return window.myApp.writeFile(path, content);
    },

    renameFile: (path, newPath) => {
        // console.log(newPath);
        // return fs.rename(path, newPath);
        return window.myApp.renameFile(path, newPath);
    },

    deleteFile: (path) => {
        // return fs.unlink(path);
        return window.myApp.deleteFile(path);
    }
}

export default fileDealer;