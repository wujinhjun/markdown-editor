import { useEffect } from "react";

const useIpcRenderer = (keyCallback) => {

    useEffect(() => {
        Object.keys(keyCallback).forEach((key) => {
            window.myApp.listenIPC(key, keyCallback[key]);
        })

        return () => {
            Object.keys(keyCallback).forEach((key) => {
                window.myApp.removeListenIPC(key, keyCallback[key]);
            })
        }
    })
}

export default useIpcRenderer;