import { useState } from 'react';
import type { Invitation } from '../../types/project';

type InvitationsFeedProps = {
    invitations: Invitation[];
    onAccept: (senderUserId: string) => void;
    onDecline: (senderUserId: string) => void;
};

export default function InvitationsFeed({ invitations, onAccept, onDecline }: InvitationsFeedProps) {
    const [respondingId, setRespondingId] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleRespond = (senderUserId: string, action: 'accept' | 'decline') => {
        setRespondingId(senderUserId);
        setTimeout(() => {
            if (action === 'accept') onAccept(senderUserId);
            else onDecline(senderUserId);
            setRespondingId(null);
            setActiveIndex(0);
        }, 500);
    };

    const hasMultiple = invitations.length > 1;
    const safeIndex = invitations.length === 0 ? 0 : Math.min(activeIndex, invitations.length - 1);
    const active = invitations[safeIndex];

    return (
        <div className="mb-4">
            {/* ── Section header ───────────────────────── */}
            <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #3b7cf8, #1d4ed8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, boxShadow: '0 3px 8px rgba(37,99,235,0.25)'
                }}>
                    <svg width="13" height="13" fill="white" viewBox="0 0 16 16">
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                    </svg>
                </div>

                <h6 className="fw-bold mb-0 menu-text" style={{ letterSpacing: '0.06em', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                    Pending Invitations
                </h6>

                {invitations.length > 0 && (
                    <span
                        className="fw-bolder rounded-pill d-flex align-items-center gap-1"
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                            color: '#fff',
                            fontSize: '0.72rem',
                            padding: '3px 10px',
                            boxShadow: '0 3px 10px rgba(239,68,68,0.40)',
                            animation: invitations.length > 1 ? 'pulse-glow-orange 2s infinite' : 'none',
                            letterSpacing: '0.02em'
                        }}
                    >
                        <svg width="9" height="9" fill="currentColor" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                        </svg>
                        {invitations.length} pending
                    </span>
                )}
            </div>

            {/* ── Empty state ───────────────────────────── */}
            {invitations.length === 0 ? (
                <div className="card border-0 bg-white rounded-4 shadow-sm p-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between interactive-card">
                    <div className="d-flex align-items-center mb-3 mb-md-0">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                            <svg width="20" height="20" fill="#adb5bd" viewBox="0 0 16 16">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                            </svg>
                        </div>
                        <div>
                            <h6 className="fw-bolder text-dark mb-0">No pending invitations</h6>
                            <div className="text-muted small mt-1">You are all caught up</div>
                        </div>
                    </div>
                    <button type="button" className="btn btn-light rounded-3 fw-bold px-3 py-2 pressable-btn" disabled>
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                        </svg>
                    </button>
                </div>
            ) : (
                /* ── Active invitation card ──────────────── */
                <div
                    className="card border-0 bg-white rounded-4 shadow-sm p-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between interactive-card fade-up"
                    style={{ borderLeft: '3px solid #3b7cf8' }}
                >
                    <div className="d-flex align-items-center mb-3 mb-md-0">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                            </svg>
                        </div>
                        <div>
                            {/* Sender name — joined from users table */}
                            <h6 className="fw-bolder text-dark mb-0">{active.sender_full_name}</h6>
                            <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                                <span className="text-muted small">
                                    ID: {active.sender_university_id}
                                </span>
                                <span className="text-muted small">·</span>
                                <span className="text-muted small">
                                    {new Date(active.created_at).toLocaleDateString()}
                                </span>
                                {hasMultiple && (
                                    <span
                                        className="fw-bold rounded-pill d-inline-flex align-items-center"
                                        style={{
                                            background: 'linear-gradient(135deg, #3b7cf8, #8b5cf6)',
                                            color: '#fff',
                                            fontSize: '0.68rem',
                                            padding: '2px 8px',
                                            letterSpacing: '0.04em'
                                        }}
                                    >
                                        {safeIndex + 1} of {invitations.length}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                        <button
                            className={`btn btn-light rounded-3 fw-bold px-3 py-2 pressable-btn ${hasMultiple ? 'soft-pulse' : ''}`}
                            onClick={() => hasMultiple && setActiveIndex((prev) => (prev + 1) % invitations.length)}
                            disabled={!hasMultiple || respondingId === active.sender_user_id}
                            aria-label="Next invitation"
                        >
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </button>

                        <button
                            className="btn btn-light text-danger fw-bold rounded-3 px-4 py-2 pressable-btn"
                            onClick={() => handleRespond(active.sender_user_id, 'decline')}
                            disabled={respondingId === active.sender_user_id}
                        >
                            {respondingId === active.sender_user_id ? '...' : 'Decline'}
                        </button>
                        <button
                            className="btn btn-primary fw-bold rounded-3 px-4 py-2 pressable-btn d-flex align-items-center gap-2"
                            onClick={() => handleRespond(active.sender_user_id, 'accept')}
                            disabled={respondingId === active.sender_user_id}
                        >
                            {respondingId === active.sender_user_id && (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            )}
                            {respondingId === active.sender_user_id ? 'Working...' : 'Accept'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}