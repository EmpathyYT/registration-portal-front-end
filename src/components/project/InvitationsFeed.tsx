import { useState } from 'react';
import type { Invitation } from '../../types/project';

type InvitationsFeedProps = {
    invitations: Invitation[];
    onAccept: (teamId: number) => void;
    onDecline: (teamId: number) => void;
};

export default function InvitationsFeed({ invitations, onAccept, onDecline }: InvitationsFeedProps) {
    const [respondingTeamId, setRespondingTeamId] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleRespond = (teamId: number, action: 'accept' | 'decline') => {
        setRespondingTeamId(teamId);
        setTimeout(() => {
            if (action === 'accept') {
                onAccept(teamId);
            } else {
                onDecline(teamId);
            }
            setRespondingTeamId(null);
        }, 500);
    };

    const hasMoreInvitations = invitations.length > 1;
    const safeActiveIndex = invitations.length === 0 ? 0 : Math.min(activeIndex, invitations.length - 1);
    const activeInvitation = invitations[safeActiveIndex];

    return (
        <div className="mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b7cf8, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 3px 8px rgba(37,99,235,0.25)' }}>
                    <svg width="13" height="13" fill="white" viewBox="0 0 16 16">
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                    </svg>
                </div>
                <h6 className="fw-bold mb-0" style={{ color: '#0f172a', letterSpacing: '0.02em', fontSize: '0.82rem', textTransform: 'uppercase' }}>Pending Invitations</h6>
            </div>

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
                    <button
                        type="button"
                        className="btn btn-light rounded-3 fw-bold px-3 py-2 pressable-btn"
                        disabled
                        aria-label="More invitations"
                    >
                        ...
                    </button>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    <div key={activeInvitation.team_id} className="card border-0 bg-white rounded-4 shadow-sm p-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between interactive-card fade-up">
                        <div className="d-flex align-items-center mb-3 mb-md-0">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                                </svg>
                            </div>
                            <div>
                                <h6 className="fw-bolder text-dark mb-0">{activeInvitation.team_name}</h6>
                                <div className="text-muted small mt-1">
                                    Sent {new Date(activeInvitation.created_at).toLocaleDateString()}
                                    {hasMoreInvitations && <span className="ms-2">({safeActiveIndex + 1}/{invitations.length})</span>}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                            <button
                                className={`btn btn-light rounded-3 fw-bold px-3 py-2 pressable-btn ${hasMoreInvitations ? 'soft-pulse' : ''}`}
                                onClick={() => hasMoreInvitations && setActiveIndex((prev) => (prev + 1) % invitations.length)}
                                disabled={!hasMoreInvitations || respondingTeamId === activeInvitation.team_id}
                                aria-label="More invitations"
                            >
                                ...
                            </button>
                            <button
                                className="btn btn-light text-danger fw-bold rounded-3 px-4 py-2 pressable-btn"
                                onClick={() => handleRespond(activeInvitation.team_id, 'decline')}
                                disabled={respondingTeamId === activeInvitation.team_id}
                            >
                                {respondingTeamId === activeInvitation.team_id ? '...' : 'Decline'}
                            </button>
                            <button
                                className="btn btn-primary fw-bold rounded-3 px-4 py-2 pressable-btn d-flex align-items-center gap-2"
                                onClick={() => handleRespond(activeInvitation.team_id, 'accept')}
                                disabled={respondingTeamId === activeInvitation.team_id}
                            >
                                {respondingTeamId === activeInvitation.team_id && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                {respondingTeamId === activeInvitation.team_id ? 'Working...' : 'Accept'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}