import React, { useState } from 'react';
import type { Team, TeamMember } from '../../types/project';

interface MyTeamPanelProps {
    team: Team;
    members: TeamMember[];
    currentUserId: string;
    onBookPresentation: () => void;
    onLeaveTeam: () => void;
    onInviteMember: () => void;
    onUpdateDoc: () => void;
    onManageMember: (member: TeamMember) => void;
}

const MOCK_SUPERVISORS = [
    { id: 'sup_1', name: 'Dr. Emad Al-Shalabi' },
    { id: 'sup_2', name: 'Dr. Ahmed Al-Salem' },
    { id: 'sup_3', name: 'Dr. Rania Mahmoud' },
    { id: 'sup_4', name: 'Dr. Khaled Al-Omari' },
];

const Avatar = ({ name }: { name: string }) => {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return (
        <div
            className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bolder shadow-sm flex-shrink-0"
            style={{ width: '48px', height: '48px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #3b7cf8, #1d4ed8)', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}
        >
            {initials}
        </div>
    );
};

export const MyTeamPanel: React.FC<MyTeamPanelProps> = ({
                                                            team, members, currentUserId, onBookPresentation, onLeaveTeam, onInviteMember, onUpdateDoc, onManageMember
                                                        }) => {

    const currentUser = members.find(m => m.user_id === currentUserId);
    const isTeamLeader = currentUser?.team_role === 'Team Leader';
    const isSupervisor = currentUserId === team.supervisor_id;
    const canManageMembers = isTeamLeader || isSupervisor;

    const [isInvitingSupervisor, setIsInvitingSupervisor] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState('');
    const [inviteState, setInviteState] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleSendInvite = () => {
        setInviteState('sending');

        setTimeout(() => {
            setInviteState('success');

            setTimeout(() => {
                console.log("Supervisor Invite Sent to:", selectedSupervisor);
                setIsInvitingSupervisor(false);
                setInviteState('idle');
                setSelectedSupervisor('');
            }, 1200);

        }, 1000);
    };

    return (
        <>
            {}
            <style>
                {`
                @keyframes slideFadeIn {
                    0% { opacity: 0; transform: translateY(-8px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-fade {
                    animation: slideFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                `}
            </style>

            <div className="card border-0 mb-5 fade-up" style={{ borderRadius: '1.25rem', boxShadow: '0 8px 32px rgba(15,23,42,0.09)', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.6)' }}>
                <div className="card-header bg-transparent border-0 pt-4 pb-0 px-4 px-md-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div className="mb-3 mb-md-0 d-flex align-items-center gap-3">
                        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b7cf8, #1d4ed8)', boxShadow: '0 4px 12px rgba(37,99,235,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="22" height="22" fill="white" viewBox="0 0 16 16">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                                <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                            </svg>
                        </div>
                        <div>
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 fw-bold mb-1" style={{ fontSize: '0.72rem' }}>Your Active Team</span>
                            <h3 className="fw-bolder mb-0" style={{ color: '#0f172a' }}>{team.Name}</h3>
                            <p className="text-secondary fw-semibold mb-0 small">{team.title}</p>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                        {!isSupervisor && (
                            <button className="btn btn-outline-danger fw-bold rounded-3 px-4 py-2 pressable-btn" onClick={onLeaveTeam}>
                                Leave Team
                            </button>
                        )}
                        <button className="btn btn-primary fw-bold shadow-sm rounded-3 px-4 py-2 pressable-btn" onClick={onBookPresentation}>
                            Book Presentation
                        </button>
                    </div>
                </div>

                <div className="card-body p-4 p-md-5">

                    <div className="mb-5 p-4 bg-light rounded-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center border border-primary border-opacity-25 gap-3">
                        <div>
                            <h6 className="fw-bold text-dark mb-1">Project Supervisor</h6>
                            <span className="text-secondary small">
                                {team.supervisor_id ? `Supervisor ID: ${team.supervisor_id}` : 'No supervisor assigned yet.'}
                            </span>
                        </div>
                        {!team.supervisor_id && isTeamLeader && (
                            isInvitingSupervisor ? (
                                
                                <div className="d-flex align-items-center gap-2 animate-slide-fade" style={{ width: '100%', maxWidth: '420px' }}>
                                    <select
                                        className="form-select form-select-sm border-primary border-opacity-25 text-secondary fw-semibold flex-grow-1"
                                        style={{ borderRadius: '0.5rem', cursor: 'pointer' }}
                                        value={selectedSupervisor}
                                        onChange={(e) => setSelectedSupervisor(e.target.value)}
                                        disabled={inviteState !== 'idle'}
                                    >
                                        <option value="">Select Professor...</option>
                                        {MOCK_SUPERVISORS.map((sup) => (
                                            <option key={sup.id} value={sup.name}>
                                                {sup.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="btn btn-light btn-sm fw-bold px-3 rounded-3 flex-shrink-0 pressable-btn"
                                        onClick={() => {
                                            setIsInvitingSupervisor(false);
                                            setSelectedSupervisor('');
                                        }}
                                        disabled={inviteState !== 'idle'}
                                    >
                                        Cancel
                                    </button>

                                    {}
                                    <button
                                        className={`btn btn-sm fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 flex-shrink-0 ${
                                            inviteState === 'success' ? 'btn-success text-white' : 'btn-primary'
                                        } pressable-btn`}
                                        style={{ width: '110px', transition: 'all 0.3s ease' }}
                                        disabled={!selectedSupervisor || inviteState !== 'idle'}
                                        onClick={handleSendInvite}
                                    >
                                        {inviteState === 'idle' && 'Send'}
                                        {inviteState === 'sending' && (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Sending
                                            </>
                                        )}
                                        {inviteState === 'success' && (
                                            <>
                                                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                                                </svg>
                                                Sent!
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <button className="btn btn-primary btn-sm fw-bold rounded-3 px-4 py-2 pressable-btn" onClick={() => setIsInvitingSupervisor(true)}>
                                    Invite Supervisor
                                </button>
                            )
                        )}
                    </div>

                    <h6 className="fw-bold text-muted mb-4 text-uppercase tracking-wide">Team Members</h6>

                    <div className="list-group list-group-flush gap-3 mb-3">
                        {members.map((member) => (
                            <div key={member.user_id} className="list-group-item border-0 p-3 bg-light rounded-4 d-flex align-items-center interactive-card">
                                <Avatar name={member.full_name} />
                                <div className="ms-3 flex-grow-1">
                                    <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                                        {member.full_name}
                                        {member.user_id === currentUserId && <span className="badge bg-secondary opacity-50 fw-normal" style={{fontSize: '0.65rem'}}>You</span>}
                                    </h6>
                                    <span className="text-muted small">ID: {member.university_id}</span>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <span className={`badge ${member.team_role === 'Team Leader' ? 'bg-primary' : 'bg-white text-dark border'} shadow-sm rounded-pill px-3 py-2`}>
                                        {member.team_role}
                                    </span>
                                    {canManageMembers && member.user_id !== currentUserId && (
                                        <button
                                            className="btn btn-sm btn-light text-primary fw-bold px-3 rounded-3 pressable-btn"
                                            onClick={() => onManageMember(member)}
                                        >
                                            Manage
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {members.length < team.max_users && (
                        <button className="btn btn-light text-primary fw-bold w-100 rounded-4 py-3 border-dashed mb-5 pressable-btn" onClick={onInviteMember} style={{ border: '2px dashed #cfe2ff', transition: 'all 0.2s ease' }}>
                            + Invite New Member
                        </button>
                    )}

                    <div className="p-4 bg-primary bg-opacity-10 rounded-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h6 className="fw-bold text-primary mb-1">Project Documentation</h6>
                            <span className="text-secondary small">
                                {team.introduction_link ? 'Official document link is active.' : 'No document link provided yet.'}
                            </span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            {team.introduction_link && (
                                <a href={team.introduction_link} target="_blank" rel="noreferrer" className="btn btn-white text-primary border-0 fw-bold shadow-sm rounded-3 px-4 py-2 bg-white pressable-btn">
                                    Open Link
                                </a>
                            )}
                            <button onClick={onUpdateDoc} className="btn btn-primary fw-bold shadow-sm rounded-3 px-4 py-2 pressable-btn">
                                {team.introduction_link ? 'Edit Link' : 'Add Link'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyTeamPanel;