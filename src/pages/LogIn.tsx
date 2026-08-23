import { useState } from 'react';
import PageMenu from '../components/layout/PageMenu';

type LogInProps = {
    onLogin: () => void;
    isDark: boolean;
    onToggleDark: () => void;
};

export default function LogIn({ onLogin, isDark, onToggleDark }: LogInProps) {
    const [uniId, setUniId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log('Logging in with:', { uniId, password });
        setTimeout(() => {
            onLogin();
        }, 650);
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center px-3 login-bg" style={{ paddingTop: '5rem' }}>
            {/* Navbar — dark toggle only, no switch/logout */}
            <PageMenu isDark={isDark} onToggleDark={onToggleDark} />

            <div className="card login-card border-0 w-100 bounce-in shadow-lg" style={{ maxWidth: '460px', borderRadius: '1.25rem' }}>
                <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-bolder mb-1 page-title">Portal Login</h2>
                        <p className="text-muted mb-0 small">Sign in once, then switch between pages from the top menu.</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="form-label fw-bold text-secondary small text-uppercase" style={{ letterSpacing: '0.06em' }}>UNI ID</label>
                            <input
                                type="text"
                                className="form-control form-control-lg bg-light border-0 input-animated autofill-fix"
                                placeholder="Enter your University ID"
                                value={uniId}
                                onChange={(e) => setUniId(e.target.value)}
                                style={{ borderRadius: '0.85rem' }}
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label className="form-label fw-bold text-secondary small text-uppercase" style={{ letterSpacing: '0.06em' }}>Password</label>
                            <div className="position-relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control form-control-lg bg-light border-0 pe-5 input-animated autofill-fix"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ borderRadius: '0.85rem' }}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn border-0 position-absolute end-0 top-50 translate-middle-y me-2 d-flex align-items-center justify-content-center eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isSubmitting}
                                    style={{ backgroundColor: 'transparent', boxShadow: 'none', padding: '0.5rem', transition: 'color 0.18s ease' }}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" /><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" /></svg>
                                    ) : (
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" /><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.708z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success btn-lg w-100 fw-bold pressable-btn d-flex align-items-center justify-content-center gap-2"
                            style={{ borderRadius: '0.85rem', padding: '0.85rem' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
