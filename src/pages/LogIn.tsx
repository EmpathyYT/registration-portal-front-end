import { useState, useEffect } from 'react';
import type { UserRole } from '../App';
import PageMenu from '../components/layout/PageMenu';
import FloatingNotice, { type NoticeState } from '../components/layout/FloatingNotice';
import { authRepository } from '../features/auth/repositories/auth_repository';
import { styles } from '../styles/pages/LogInStyles';

type LogInProps = {
    onLogin: (role: UserRole) => void;
    isDark: boolean;
    onToggleDark: () => void;
};

export default function LogIn({ onLogin, isDark, onToggleDark }: LogInProps) {
    const [uniId, setUniId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notice, setNotice] = useState<NoticeState>(null);

    useEffect(() => {
        if (!notice) return;
        const id = window.setTimeout(() => setNotice(null), 2600);
        return () => window.clearTimeout(id);
    }, [notice]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotice(null);
        try {
            const user = await authRepository.login(uniId.trim(), password);
            const role: UserRole = user.role === 'supervisor' ? 'supervisor' : 'student';
            onLogin(role);
        } catch {
            setNotice({ type: 'error', message: 'Invalid University ID or password. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <PageMenu isDark={isDark} onToggleDark={onToggleDark} />
            <FloatingNotice notice={notice} />

            <div className={styles.card}>
                <div className={styles.cardBody}>
                    <div className={styles.heading}>
                        <h2 className={styles.title}>Portal Login</h2>
                        <p className={styles.subtitle}>Al-Balqa' Applied University student &amp; staff portal.</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className={styles.fieldWrap}>
                            <label className={styles.label}>UNI ID</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Enter your University ID"
                                value={uniId}
                                onChange={(e) => setUniId(e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className={styles.fieldWrap}>
                            <label className={styles.label}>Password</label>
                            <div className={styles.passwordWrap}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={styles.passwordInput}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.eyeBtn}
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isSubmitting}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" /><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" /></svg>
                                    ) : (
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" /><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.708z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                            {isSubmitting && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
