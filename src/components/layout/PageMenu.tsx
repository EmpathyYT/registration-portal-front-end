import { useEffect, useRef, useState } from 'react';

type PageMenuProps = {
    isDark: boolean;
    onToggleDark: () => void;
    switchLabel?: string;
    onSwitchPage?: () => void;
    onLogout?: () => void;
};

export default function PageMenu({ switchLabel, onSwitchPage, onLogout, isDark, onToggleDark }: PageMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const menuRef = useRef<HTMLDivElement>(null);
    const lastScrollYRef = useRef(0);

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const cur = window.scrollY;
            const prev = lastScrollYRef.current;
            if (cur <= 8) setIsVisible(true);
            else if (cur > prev) { setIsVisible(false); setIsOpen(false); }
            else setIsVisible(true);
            lastScrollYRef.current = cur;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSwitch = () => { setIsOpen(false); onSwitchPage?.(); };
    const handleLogout = () => { setIsOpen(false); onLogout?.(); };

    return (
        <div className={`position-fixed top-0 start-0 w-100 glass-navbar ${isVisible ? '' : 'navbar-hidden'}`}>
            <div className="container py-2 d-flex justify-content-between align-items-center container-main">
                <div className="d-flex align-items-center gap-2 brand-link">
                    <img src="/bau-logo.png" alt="Al-Balqa' Applied University" className="brand-logo" />
                    <div>
                        <span className="fw-bolder navbar-brand-text d-none d-md-block brand-text-desktop">
                            Al-Balqa' Applied University
                        </span>
                        <span className="fw-bolder navbar-brand-text d-block d-md-none brand-text-mobile">
                            BAU Portal
                        </span>
                    </div>
                </div>

                <div className="position-relative" ref={menuRef}>
                    <button
                        type="button"
                        className="btn menu-trigger d-flex align-items-center justify-content-center pressable-btn"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Open menu"
                        aria-expanded={isOpen}
                    >
                        <svg className={`menu-icon ${isOpen ? 'open' : ''}`} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" viewBox="0 0 24 24">
                            <line x1="4" y1="6"  x2="20" y2="6"  />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="18" x2="20" y2="18" />
                        </svg>
                    </button>

                    {isOpen && (
                        <div className="position-absolute end-0 mt-2 rounded-4 overflow-hidden glass-dropdown animate-slide-fade menu-dropdown">
                            <div className="menu-dropdown-inner">
                                <button
                                    type="button"
                                    className="btn w-100 text-start px-3 py-2 menu-action fw-semibold d-flex align-items-center justify-content-between dark-toggle-btn menu-item-btn"
                                    onClick={onToggleDark}
                                >
                                    <span className="d-flex align-items-center gap-2">
                                        {isDark ? (
                                            <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                                            </svg>
                                        ) : (
                                            <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
                                            </svg>
                                        )}
                                        {isDark ? 'Light Mode' : 'Dark Mode'}
                                    </span>
                                    <span className={`dark-toggle-pill ${isDark ? 'active' : ''}`} aria-hidden="true">
                                        <span className="dark-toggle-thumb" />
                                    </span>
                                </button>

                                {onSwitchPage && switchLabel && (
                                    <>
                                        <div className="menu-divider" />
                                        <button
                                            type="button"
                                            className="btn text-decoration-none w-100 text-start px-3 py-2 pressable-btn menu-action fw-semibold menu-text menu-item-btn"
                                            onClick={handleSwitch}
                                        >
                                            <svg className="me-2" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                                            </svg>
                                            Switch to {switchLabel}
                                        </button>
                                    </>
                                )}

                                {onLogout && (
                                    <>
                                        <div className="menu-divider" />
                                        <button
                                            type="button"
                                            className="btn text-decoration-none text-danger w-100 text-start px-3 py-2 pressable-btn menu-action fw-semibold menu-item-btn"
                                            onClick={handleLogout}
                                        >
                                            <svg className="me-2" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                                            </svg>
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
