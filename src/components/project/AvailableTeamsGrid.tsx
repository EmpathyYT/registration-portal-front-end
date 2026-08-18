import React, { useState } from 'react';
import type { Team } from '../../types/project';

interface AvailableTeamsGridProps {
    teams: Team[];
    onJoinRequest: (team_id: number) => void;
    onCreateTeam: () => void;
}

export const AvailableTeamsGrid: React.FC<AvailableTeamsGridProps> = ({ teams, onJoinRequest, onCreateTeam }) => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [requestedTeams, setRequestedTeams] = useState<number[]>([]);

    const handleRequest = (team_id: number) => {
        setRequestedTeams([...requestedTeams, team_id]);
        onJoinRequest(team_id);
    };

    return (
        <div className="mb-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h4 className="fw-bolder text-dark mb-0">Explore Teams</h4>
                    <span className="text-muted small fw-semibold">{teams.length} Teams Recruiting</span>
                </div>
                <button className="btn btn-primary fw-bold shadow-sm rounded-3 px-4 py-2" onClick={onCreateTeam}>
                    + Create New Project
                </button>
            </div>

            {teams.length === 0 ? (
                <div className="alert bg-white border-0 shadow-sm rounded-4 p-5 text-center">
                    <h5 className="text-muted fw-bold">No teams available right now.</h5>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                    {teams.map((team) => {
                        const fillPercentage = (team.min_users / team.max_users) * 100;
                        const isHovered = hoveredCard === team.team_id;
                        const hasRequested = requestedTeams.includes(team.team_id);

                        return (
                            <div key={team.team_id} className="col">
                                <div
                                    className="card h-100 border-0 bg-white"
                                    onMouseEnter={() => setHoveredCard(team.team_id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        borderRadius: '1rem',
                                        boxShadow: isHovered ? '0 1rem 3rem rgba(0,0,0,0.1)' : '0 0.5rem 1.5rem rgba(0,0,0,0.05)',
                                        transform: isHovered ? 'translateY(-5px)' : 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div className="card-body p-4 d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-bold">
                                                {team.status}
                                            </span>
                                        </div>

                                        <h5 className="card-title fw-bolder text-dark mb-1">{team.Name}</h5>
                                        <p className="card-text text-secondary small fw-semibold mb-4">{team.title}</p>

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
                                                className={`btn w-100 fw-bold rounded-3 py-2 ${hasRequested ? 'btn-secondary' : isHovered ? 'btn-primary shadow-sm' : 'btn-light text-primary'}`}
                                                style={{ transition: 'all 0.2s ease' }}
                                                onClick={() => handleRequest(team.team_id)}
                                                disabled={hasRequested}
                                            >
                                                {hasRequested ? 'Requested' : 'Request to Join'}
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