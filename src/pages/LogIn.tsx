import React, { useState } from 'react';

export default function LogIn() {
    const [activePortal, setActivePortal] = useState<'registration' | 'project'>('registration');

    const [uniId, setUniId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e: React.FormEvent, portalName: string) => {
        e.preventDefault();
        console.log(`Logging into ${portalName} with:`, { uniId, password });
    };

    const activeStyle: React.CSSProperties = {
        transform: 'translateX(0) translateY(0) scale(1)',
        zIndex: 10,
        opacity: 1,
        filter: 'drop-shadow(0 1.5rem 2rem rgba(0,0,0,0.12))',
        pointerEvents: 'none',
    };

    const getInactiveStyle = (type: 'registration' | 'project'): React.CSSProperties => ({
        transform: type === 'registration'
            ? 'translateX(-60px) translateY(-20px) scale(0.92)'
            : 'translateX(60px) translateY(-20px) scale(0.92)',
        zIndex: 1,
        opacity: 0.6,
        filter: 'drop-shadow(0 0.5rem 1rem rgba(0,0,0,0.05))',
        pointerEvents: 'none',
    });

    const wrapperBaseStyle: React.CSSProperties = {
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        width: '100%',
        maxWidth: '450px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center overflow-hidden" style={{ backgroundColor: '#f8f9fc' }}>

            <style>
                {`
                .modern-folder-tab {
                    position: relative;
                    background-color: #fff;
                    font-weight: 900;
                    font-size: 1.1rem;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    cursor: pointer;
                    pointer-events: auto;
                    z-index: 1;
                }

                /* Left Tab (Registration) */
                .tab-left {
                    padding: 14px 40px 14px 30px;
                    border-radius: 1.5rem 1.5rem 0 0; /* FIX: Fully rounds BOTH top corners to eliminate the sharp point */
                    color: #198754;
                    margin-right: 35px; 
                }
                .tab-left::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: -25px;
                    bottom: 0;
                    width: 50px;
                    background-color: #fff;
                    transform: skewX(30deg); /* Softer slope angle */
                    transform-origin: bottom left;
                    border-radius: 1.5rem 1.5rem 0 0; /* Perfectly rounds the slope to blend seamlessly */
                    z-index: -1;
                }

                /* Right Tab (Project) */
                .tab-right {
                    padding: 14px 30px 14px 40px;
                    border-radius: 1.5rem 1.5rem 0 0; /* FIX: Fully rounds BOTH top corners */
                    color: #0d6efd;
                    margin-left: 35px;
                }
                .tab-right::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -25px;
                    bottom: 0;
                    width: 50px;
                    background-color: #fff;
                    transform: skewX(-30deg); /* Softer slope angle */
                    transform-origin: bottom right;
                    border-radius: 1.5rem 1.5rem 0 0; /* Perfectly rounds the slope to blend seamlessly */
                    z-index: -1;
                }
                `}
            </style>

            <div style={{ position: 'relative', width: '100%', maxWidth: '600px', height: '520px', marginTop: '40px' }}>


                <div style={{ ...wrapperBaseStyle, ...(activePortal === 'project' ? activeStyle : getInactiveStyle('project')) }}>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div
                            className="modern-folder-tab tab-right"
                            onClick={() => setActivePortal('project')}
                        >
                            Project
                        </div>
                    </div>

                    <div
                        className="bg-white p-4 p-md-5 position-relative"
                        style={{
                            flexGrow: 1,
                            borderRadius: '1.5rem 0 1.5rem 1.5rem',
                            pointerEvents: activePortal === 'project' ? 'auto' : 'none'
                        }}
                    >
                        {activePortal !== 'project' && (
                            <div
                                className="position-absolute top-0 start-0 w-100 h-100 z-3"
                                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                                onClick={() => setActivePortal('project')}
                            ></div>
                        )}

                        <div className="d-flex justify-content-between align-items-start mb-4 mt-1">
                            <h2 className="fw-bolder text-primary mb-0" style={{ letterSpacing: '-0.5px' }}>Project Portal</h2>
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-bold">Project</span>
                        </div>
                        <p className="text-muted small fw-semibold mb-4">Sign in to manage your final year team, tasks, and presentations.</p>

                        <form onSubmit={(e) => handleLogin(e, 'Project')}>
                            <div className="mb-4">
                                <label className="form-label fw-bold text-secondary small text-uppercase tracking-wide">UNI ID</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg bg-light border-0"
                                    placeholder="Enter your University ID"
                                    value={uniId}
                                    onChange={(e) => setUniId(e.target.value)}
                                    style={{ borderRadius: '0.75rem' }}
                                    required
                                />
                            </div>

                            <div className="mb-5">
                                <label className="form-label fw-bold text-secondary small text-uppercase tracking-wide">Password</label>
                                <div className="position-relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control form-control-lg bg-light border-0 pe-5"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ borderRadius: '0.75rem' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn border-0 position-absolute end-0 top-50 translate-middle-y me-2 z-3 d-flex align-items-center justify-content-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ color: '#6c757d', backgroundColor: 'transparent', boxShadow: 'none', padding: '0.5rem' }}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>
                                        ) : (
                                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.708z"/></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm" style={{ borderRadius: '0.75rem', padding: '0.8rem' }}>
                                Sign In to Project
                            </button>
                        </form>
                    </div>
                </div>



                <div style={{ ...wrapperBaseStyle, ...(activePortal === 'registration' ? activeStyle : getInactiveStyle('registration')) }}>

                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div
                            className="modern-folder-tab tab-left"
                            onClick={() => setActivePortal('registration')}
                        >
                            Course
                        </div>
                    </div>


                    <div
                        className="bg-white p-4 p-md-5 position-relative"
                        style={{
                            flexGrow: 1,
                            borderRadius: '0 1.5rem 1.5rem 1.5rem',
                            pointerEvents: activePortal === 'registration' ? 'auto' : 'none'
                        }}
                    >
                        {activePortal !== 'registration' && (
                            <div
                                className="position-absolute top-0 start-0 w-100 h-100 z-3"
                                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                                onClick={() => setActivePortal('registration')}
                            ></div>
                        )}

                        <div className="d-flex justify-content-between align-items-start mb-4 mt-1">
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 fw-bold">Registration</span>
                            <h2 className="fw-bolder text-success mb-0" style={{ letterSpacing: '-0.5px' }}>Course Portal</h2>
                        </div>
                        <p className="text-muted small fw-semibold mb-4 text-start">Enter your University information to access the Course Registration Portal.</p>

                        <form onSubmit={(e) => handleLogin(e, 'Registration')}>
                            <div className="mb-4">
                                <label className="form-label fw-bold text-secondary small text-uppercase tracking-wide">UNI ID</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg bg-light border-0"
                                    placeholder="Enter your University ID"
                                    value={uniId}
                                    onChange={(e) => setUniId(e.target.value)}
                                    style={{ borderRadius: '0.75rem' }}
                                    required
                                />
                            </div>

                            <div className="mb-5">
                                <label className="form-label fw-bold text-secondary small text-uppercase tracking-wide">Password</label>
                                <div className="position-relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control form-control-lg bg-light border-0 pe-5"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ borderRadius: '0.75rem' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn border-0 position-absolute end-0 top-50 translate-middle-y me-2 z-3 d-flex align-items-center justify-content-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ color: '#6c757d', backgroundColor: 'transparent', boxShadow: 'none', padding: '0.5rem' }}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>
                                        ) : (
                                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.708z"/></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-success btn-lg w-100 fw-bold shadow-sm" style={{ borderRadius: '0.75rem', padding: '0.8rem' }}>
                                Sign In to Registration
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}