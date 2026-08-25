import React, { useState } from 'react';
import type { Team } from '../../types/project';

interface AvailableTeamsGridProps {
    teams: Team[];
    onJoinRequest: (team_id: number) => void;
    onCreateTeam?: () => void;
    // optional customisation for supervisor mode
    title?: string;        // default: "Explore Teams"
    actionLabel?: string;  // default: "Request to Join"
    showCreate?: boolean;  // default: true
}

export const AvailableTeamsGrid: React.FC<AvailableTeamsGridProps> = ({
    teams, onJoinRequest, onCreateTeam,
    title = 'Explore Teams',
    actionLabel = 'Request to Join',
    showCreate = true,
}) => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [actedTeams, setActedTeams] = useState<number[]>([]);
    const [actingTeamId, setActingTeamId] = useState<number | null>(null);

    const handleRequest = (team_id: number) => {
        setActingTeamId(team_id);
        setTimeout(() => {
            setActedTeams((prev) => [...prev, team_id]);
            setActingTeamId(null);
            onJoinRequest(team_id);
        }, 550);
    };

    return (
        <div className="mb-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <div className="d-flex align-items-center gap-2">
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b7cf8, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
                            <svg width="17" height="17" fill="white" viewBox="0 0 16 16">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                                <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                            </svg>
                        </div>
                        <h4 className="fw-bolder mb-0 page-title">{title}</h4>
                    </div>
                    <span className="text-muted small fw-semibold">{teams.length} team{teams.length !== 1 ? 's' : ''} available</span>
                </div>
                {showCreate && onCreateTeam && (
                    <button className="btn btn-primary fw-bold shadow-sm rounded-3 px-4 py-2 pressable-btn" onClick={onCreateTeam}>
                        + Create New Project
                    </button>
                )}
            </div>

            {teams.length === 0 ? (
                <div className="alert bg-white border-0 shadow-sm rounded-4 p-5 text-center">
                    <h5 className="text-muted fw-bold">No teams available right now.</h5>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                    {teams.map((team, index) => {
                        const fillPercentage = (team.min_users / team.max_users) * 100;
                        const isHovered = hoveredCard === team.team_id;
                        const hasActed = actedTeams.includes(team.team_id);
                        const isActing = actingTeamId === team.team_id;

                        return (
                            <div key={team.team_id} className="col section-enter" style={{ animationDelay: `${index * 70}ms` }}>
                                <div
                                    className="card h-100 border-0 interactive-card"
                                    onMouseEnter={() => setHoveredCard(team.team_id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        borderRadius: '1rem',
                                        boxShadow: isHovered ? '0 16px 48px rgba(15,23,42,0.13)' : '0 4px 20px rgba(15,23,42,0.07)',
                                        transform: isHovered ? 'translateY(-5px)' : 'none',
                                        transition: 'all 0.3s ease',
                                        background: 'rgba(255,255,255,0.88)',
                                        backdropFilter: 'blur(10px)',
                                        WebkitBackdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.6)'
                                    }}
                                >
                                    <div className="card-body p-4 d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-bold">
                                                {team.status}
                                            </span>
                                        </div>

                                        <h5 className="card-title fw-bolder text-dark mb-4">{team.project_title}</h5>

                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between text-muted small fw-bold mb-2">
                                                <span>Capacity</span>
                                                <span>{team.min_users} / {team.max_users} Members</span>
                                            </div>
                                            <div className="progress mb-4" style={{ height: '8px', borderRadius: '10px' }}>
                                                <div
                                                    className="progress-bar bg-primary"
                                                    role="progressbar"
                                                    style={{ width: `${fillPercentage}%`, borderRadius: '10px' }}
                                                ></div>
                                            </div>

                                            <button
                                                className={`btn w-100 fw-bold rounded-3 py-2 pressable-btn d-flex align-items-center justify-content-center gap-2 ${hasActed ? 'btn-secondary' : isHovered ? 'btn-primary shadow-sm' : 'btn-light text-primary'}`}
                                                style={{ transition: 'all 0.2s ease' }}
                                                onClick={() => handleRequest(team.team_id)}
                                                disabled={hasActed || isActing}
                                            >
                                                {isActing && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                                {hasActed ? '✓ Done' : isActing ? 'Working...' : actionLabel}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AvailableTeamsGrid;