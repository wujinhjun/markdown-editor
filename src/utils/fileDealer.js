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
// fileDealer.writeFile("/test/hello.md", "# hello");
// const location = "F:/electron-exercise/markdown-editor/src/utils/test";
// console.log(path.join(__dirname, 'preload.js'))
// fs.writeFile(location + "/hello.md", "# hello")
//     .then(() => {
//         console.log("ok");
//     })
//     .catch((err) => {
//         console.log(err);
//     })

// fileDealer.readFile(location + "/hello.md")
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     })

// fileDealer.renameFile(location + "/hello.md", location + "/hello2.md")
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     })
// fileDealer.deleteFile(location + "/hello2.md")
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     })