import { useEffect, useRef, useState } from 'react';
import { styles } from '../../styles/components/layout/PageMenuStyles';
import ChatbotWidget from '../chatbot/ChatbotWidget';

type PageMenuProps = {
    isDark: boolean;
    onToggleDark: () => void;
    switchLabel?: string;
    onSwitchPage?: () => void;
    onLogout?: () => void;
    userRole?: string;
};

export default function PageMenu({ switchLabel, onSwitchPage, onLogout, isDark, onToggleDark, userRole }: PageMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
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
        <div className={styles.navbar(isVisible)}>
            <div className={styles.inner}>
                <div className={styles.brand}>
                    <img src="/bau-logo.png" alt="Al-Balqa' Applied University" className={styles.brandLogo} />
                    <div>
                        <span className={styles.brandDesktop}>Al-Balqa' Applied University</span>
                        <span className={styles.brandMobile}>BAU Portal</span>
                    </div>
                </div>

                <div className={styles.menuWrap} ref={menuRef}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {userRole && (
                            <button type="button" className={styles.chatBtn} onClick={() => setIsChatOpen(!isChatOpen)}>
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                                </svg>
                                <span className="d-none d-md-inline">AI Assistant</span>
                            </button>
                        )}

                        <button
                            type="button"
                            className={styles.menuTrigger}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Open menu"
                            aria-expanded={isOpen}
                        >
                            <svg className={styles.menuIcon(isOpen)} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" viewBox="0 0 24 24">
                                <line x1="4" y1="6"  x2="20" y2="6"  />
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <line x1="4" y1="18" x2="20" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {isOpen && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownInner}>
                                <button type="button" className={styles.darkToggleBtn} onClick={onToggleDark}>
                                    <span className={styles.darkToggleLabel}>
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
                                    <span className={styles.darkTogglePill(isDark)} aria-hidden="true">
                                        <span className={styles.darkToggleThumb} />
                                    </span>
                                </button>

                                {onSwitchPage && switchLabel && (
                                    <>
                                        <div className={styles.divider} />
                                        <button type="button" className={styles.switchBtn} onClick={handleSwitch}>
                                            <svg className={styles.switchIcon} width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                                            </svg>
                                            Switch to {switchLabel}
                                        </button>
                                    </>
                                )}

                                {onLogout && (
                                    <>
                                        <div className={styles.divider} />
                                        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                                            <svg className={styles.logoutIcon} width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
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
            {userRole && <ChatbotWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} userRole={userRole} />}
        </div>
    );
}
