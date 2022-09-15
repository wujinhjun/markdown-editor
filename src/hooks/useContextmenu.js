import { useRef } from "react"
import { useEffect } from "react"

const useContextmenu = (targetElement, devList) => {
    const clickElement = useRef(null);

    useEffect(() => {
        const handleElement = (e) => {
            if (document.querySelector(targetElement).contains(e.target)) {
                clickElement.current = e.target;
                e.preventDefault();
                window.myApp.openContextDialog();
            }

        };

        window.addEventListener("contextmenu", handleElement);

        return () => {
            window.removeEventListener("contextmenu", handleElement);
        }

    }, devList);

    return clickElement;
}

export default useContextmenu;