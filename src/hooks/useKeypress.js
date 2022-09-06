import { useState, useEffect } from "react";

const useKeypress = (targetKeyCode) => {
    const [keyPress, setKeyPress] = useState(false);

    const keyDown = (keyCode) => {
        if (keyCode === targetKeyCode) {
            setKeyPress(true);
        }
    };

    const keyUp = (keyCode) => {
        if (keyCode === targetKeyCode) {
            setKeyPress(false);
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', keyDown);
        document.addEventListener('keyup', keyUp);

        return () => {
            document.removeEventListener('keydown', keyDown);
            document.removeEventListener('keyup', keyUp);
        }
    }, [])
    return keyPress;
}

export default useKeypress;