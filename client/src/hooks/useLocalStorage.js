import { useEffect, useRef, useState } from "react";

/**
 * 小さめデバウンス付き localStorage フック
 */
export function useLocalStorage(key, initialValue, delay = 150) {
    const [value, setValue] = useState(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const timer = useRef(null);
    useEffect(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch {
                // 容量超などは握りつぶす（必要ならUI通知）
            }
        }, delay);
        return () => clearTimeout(timer.current);
    }, [key, value, delay]);

    return [value, setValue];
}
