import { useState } from 'react';

export default function InvitationsFeed() {
    // State to manage the list of invitations
    const [invitations, setInvitations] = useState([
        { id: 1, teamName: 'Delta Force', date: 'Sent 8/15/2026' }
    ]);

    const handleRespond = (id: number, action: 'accept' | 'decline') => {
        console.log(`You chose to ${action} invitation ID: ${id}`);
        setInvitations(invitations.filter(inv => inv.id !== id));
    };

    return (
        <div className="mb-4">
            <h6 className="fw-bold text-secondary small text-uppercase tracking-wide mb-3" style={{ letterSpacing: '0.5px' }}>
                Pending Invitations
            </h6>

            {invitations.length === 0 ? (
                // --- FIXED EMPTY STATE: Matches image_5b0b40.png perfectly ---
                <div className="card border-0 bg-white rounded-4 shadow-sm py-4 d-flex flex-column align-items-center justify-content-center text-center">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-2" style={{ width: '36px', height: '36px' }}>
                        <svg width="16" height="16" fill="#adb5bd" viewBox="0 0 16 16">
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                        </svg>
                    </div>
                    <h6 className="fw-bold text-secondary mb-0 small">No pending invitations</h6>
                </div>
            ) : (
                // --- THE INVITATIONS LIST ---
                <div className="d-flex flex-column gap-3">
                    {invitations.map(inv => (
                        <div key={inv.id} className="card border-0 bg-white rounded-4 shadow-sm p-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                            <div className="d-flex align-items-center mb-3 mb-md-0">
                                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h6 className="fw-bolder text-dark mb-0">{inv.teamName}</h6>
                                    <div className="text-muted small mt-1">{inv.date}</div>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-light text-danger fw-bold rounded-3 px-4 py-2"
                                    onClick={() => handleRespond(inv.id, 'decline')}
                                >
                                    Decline
                                </button>
                                <button
                                    className="btn btn-primary fw-bold rounded-3 px-4 py-2"
                                    onClick={() => handleRespond(inv.id, 'accept')}
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}