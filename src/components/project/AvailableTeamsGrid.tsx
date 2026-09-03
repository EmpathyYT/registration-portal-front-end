import React, { useState } from 'react';
import type { Team } from '../../types/project';
import { styles } from '../../styles/components/project/AvailableTeamsGridStyles';

interface AvailableTeamsGridProps {
    teams: Team[];
    onJoinRequest: (team_id: number) => void;
    onCreateTeam?: () => void;
    title?: string;
    actionLabel?: string;
    showCreate?: boolean;
}

export const AvailableTeamsGrid: React.FC<AvailableTeamsGridProps> = ({
    teams, onJoinRequest, onCreateTeam,
    title = 'Explore Teams',
    actionLabel = 'Request to Join',
    showCreate = true,
}) => {
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
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <div className={styles.titleRow}>
                        <div className={styles.icon}>
                            <svg width="17" height="17" fill="white" viewBox="0 0 16 16">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                                <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                            </svg>
                        </div>
                        <h4 className={styles.title}>{title}</h4>
                    </div>
                    <span className={styles.subtitle}>{teams.length} team{teams.length !== 1 ? 's' : ''} available</span>
                </div>
                {showCreate && onCreateTeam && (
                    <button className={styles.createBtn} onClick={onCreateTeam}>
                        + Create New Project
                    </button>
                )}
            </div>

            {teams.length === 0 ? (
                <div className={styles.emptyAlert}>
                    <h5 className={styles.emptyText}>No teams available right now.</h5>
                </div>
            ) : (
                <div className={styles.grid}>
                    {teams.map((team, index) => {
                        const hasActed = actedTeams.includes(team.team_id);
                        const isActing = actingTeamId === team.team_id;

                        return (
                            <div key={team.team_id} className={styles.col} style={{ animationDelay: `${index * 70}ms` }}>
                                <div className={styles.card}>
                                    <div className={styles.cardBody}>
                                        <div className={styles.cardTop}>
                                            <span className={styles.statusBadge}>{team.status}</span>
                                        </div>
                                        <h5 className={styles.cardTitle}>{team.project_title}</h5>
                                        <div className={styles.cardBottom}>
                                            <div className={styles.capacityRow}>
                                                <span>Team Size</span>
                                                <span>{team.min_users}–{team.max_users} Members</span>
                                            </div>
                                            <button
                                                className={styles.actionBtn(hasActed)}
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