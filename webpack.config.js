const path = require("path");

module.exports = {
    target: "electron-main",
    mode: "production",
    entry: "./main.js",
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "main.js"
    },
    node: {
        __dirname: false
    },
}