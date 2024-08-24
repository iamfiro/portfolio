import { useEffect, useRef } from 'react';

function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<number | undefined>();

    function debouncedFunction(...args: Parameters<T>) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            callback(...args);
        }, delay);
    }

    // Cleanup timeout if the component is unmounted
    useEffect(() => {
        return () => {
            window.clearTimeout(timeoutRef.current);
        };
    }, []);

    return debouncedFunction;
}

export default useDebounce;
