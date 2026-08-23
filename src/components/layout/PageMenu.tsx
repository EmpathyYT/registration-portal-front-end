import { useEffect, useRef, useState } from 'react';

type PageMenuProps = {
    switchLabel: string;
    onSwitchPage: () => void;
    onLogout: () => void;
};

export default function PageMenu({ switchLabel, onSwitchPage, onLogout }: PageMenuProps) {
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

    const handleSwitch = () => { setIsOpen(false); onSwitchPage(); };
    const handleLogout = () => { setIsOpen(false); onLogout(); };

    return (
        <div
            className="position-fixed top-0 start-0 w-100 glass-navbar"
            style={{
                zIndex: 1050,
                transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
                transition: 'transform 220ms ease'
            }}
        >
            <div className="container py-2 d-flex justify-content-between align-items-center" style={{ maxWidth: '1100px' }}>

                <div className="d-flex align-items-center gap-2 text-decoration-none" style={{ userSelect: 'none' }}>
                    <span className="fw-bolder" style={{ fontSize: '0.95rem', color: '#0f172a', letterSpacing: '-0.01em' }}>
                        UniPortal
                    </span>
                </div>

                <div className="position-relative" ref={menuRef}>
                    <button
                        type="button"
                        className="btn menu-trigger d-flex align-items-center justify-content-center pressable-btn"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Open menu"
                        aria-expanded={isOpen}
                    >
                        <svg
                            className={`menu-icon ${isOpen ? 'open' : ''}`}
                            width="18" height="18"
                            fill="none" stroke="currentColor"
                            strokeWidth="2.4" strokeLinecap="round"
                            viewBox="0 0 24 24"
                        >
                            <line x1="4" y1="6"  x2="20" y2="6"  />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="18" x2="20" y2="18" />
                        </svg>
                    </button>

                    {isOpen && (
                        <div
                            className="position-absolute end-0 mt-2 rounded-4 overflow-hidden glass-dropdown slide-down"
                            style={{ minWidth: '200px', zIndex: 1100 }}
                        >
                            <div style={{ padding: '0.35rem' }}>
                                <button
                                    type="button"
                                    className="btn text-decoration-none text-dark w-100 text-start px-3 py-2 pressable-btn menu-action fw-semibold"
                                    style={{ borderRadius: '0.6rem' }}
                                    onClick={handleSwitch}
                                >
                                    <svg className="me-2" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                                    </svg>
                                    Switch to {switchLabel}
                                </button>
                                <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '0.2rem 0.5rem' }} />
                                <button
                                    type="button"
                                    className="btn text-decoration-none text-danger w-100 text-start px-3 py-2 pressable-btn menu-action fw-semibold"
                                    style={{ borderRadius: '0.6rem' }}
                                    onClick={handleLogout}
                                >
                                    <svg className="me-2" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
