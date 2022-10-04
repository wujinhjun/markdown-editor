import { useState, useEffect } from "react";

const useKeypress = (targetKey) => {
    const [keyPressed, setKeyPressed] = useState(false);

    const keyDownHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    };

    const keyUpHandler = ({ key }) => {

        if (key === targetKey) {
            setKeyPressed(false);
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);
        console.log("add");

        return () => {
            console.log("remove");
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return keyPressed;
}

export default useKeypress;