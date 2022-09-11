const fs = require('node:fs/promises');
const path = require("path");
const fileDealer = {
    readFile: (path) => {
        console.log(path);
        return fs.readFile(path, { encoding: 'utf-8' });
    },

    writeFile: (path, content) => {
        console.log(path);
        return fs.writeFile(path, content, { encoding: 'utf-8' });
    },

    renameFile: (path, newPath) => {
        console.log(newPath);
        return fs.rename(path, newPath);
    },

    deleteFile: (path) => {
        return fs.unlink(path);
    }
}

export default fileDealer;