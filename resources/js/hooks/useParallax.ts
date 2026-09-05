import { useState, useEffect, type RefObject } from 'react';

export function useScrollPosition(): number {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        let ticking = false;

        const updateScroll = () => {
            setScrollY(window.scrollY);
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScroll);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        updateScroll();

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return scrollY;
}

export function useRelativeScroll(
    elementRef: RefObject<HTMLElement | null>,
    offsetCompensation = 300
): number {
    const scrollY = useScrollPosition();
    const [offsetTop, setOffsetTop] = useState(0);

    useEffect(() => {
        const updateOffset = () => {
            if (elementRef.current) {
                setOffsetTop(elementRef.current.offsetTop);
            }
        };

        updateOffset();
        window.addEventListener('resize', updateOffset);
        return () => window.removeEventListener('resize', updateOffset);
    }, [elementRef]);

    return scrollY - (offsetTop - offsetCompensation);
}


