import { debounce } from "lodash";
import { useEffect, useState } from "react";

export const useHeaderScroll = () => {
    const [show, setShow] = useState<boolean>(true);
    const [lastScrollY, setLastScrollY] = useState<number>(0);

    const controlNavbar = debounce(() => {
        if (typeof window !== "undefined") {
            const scrollY = window.scrollY;
            if (scrollY > lastScrollY && scrollY > 40) {
                // if scroll down hide the navbar
                setShow(false);
            } else {
                // if scroll up show the navbar
                if (scrollY <= 25) {
                    setShow(true);
                }
            }

            // remember current page location to use in the next move
            setLastScrollY(scrollY);
        }
    }, 10);

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", controlNavbar);

            // cleanup function
            return () => {
                window.removeEventListener("scroll", controlNavbar);
            };
        }
        return () => null;
    }, [controlNavbar, lastScrollY, show]);

    return { show };
};

export default useHeaderScroll;
