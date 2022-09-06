import { useState, useEffect } from "react";

const useKeypress = (targetKeyCode) => {
    const [keyPressed, setKeyPressed] = useState(false);

    const keyDownHandler = ({ keyCode }) => {
        // console.log(keyCode);
        if (keyCode === targetKeyCode) {
            setKeyPressed(true);
        }
    };

    const keyUpHandler = ({ keyCode }) => {
        if (keyCode === targetKeyCode) {
            setKeyPressed(false);
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        }
    }, [])
    return keyPressed;
}

export default useKeypress;