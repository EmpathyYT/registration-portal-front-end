import { useEffect, useState } from 'react';

const STORAGE_KEY = 'uniportal-dark-mode';

export function useDarkMode(): [boolean, () => void] {
    const [isDark, setIsDark] = useState<boolean>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) return stored === 'true';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        localStorage.setItem(STORAGE_KEY, String(isDark));
    }, [isDark]);

    const toggle = () => setIsDark(prev => !prev);

    return [isDark, toggle];
}
