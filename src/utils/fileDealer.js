const fileDealer = {
    readFile: (path) => {
        return window.myApp.readFile(path);
    },

    writeFile: (path, content) => {
        return window.myApp.writeFile(path, content);
    },

    renameFile: (path, newPath) => {
        return window.myApp.renameFile(path, newPath);
    },

    deleteFile: (path) => {
        return window.myApp.deleteFile(path);
    }
}

export default fileDealer;