import type { Team, TeamMember, Reservation } from '../../types/project';
import { styles, statusClass } from '../../styles/components/project/SupervisorTeamSelectorStyles';

export interface SupervisedTeamData {
    team: Team;
    members: TeamMember[];
    reservations: Reservation[];
}

interface SupervisorTeamSelectorProps {
    supervisorName: string;
    teams: SupervisedTeamData[];
    selectedTeamId: number;
    onSelectTeam: (teamId: number) => void;
}

export default function SupervisorTeamSelector({ supervisorName, teams, selectedTeamId, onSelectTeam }: SupervisorTeamSelectorProps) {
    const selected = teams.find(t => t.team.team_id === selectedTeamId);

    return (
        <div className={styles.card}>
            <div className={styles.body}>
                <div className={styles.row}>
                    <div className={styles.identityWrap}>
                        <div className={styles.icon}>
                            <svg width="24" height="24" fill="white" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                            </svg>
                        </div>
                        <div>
                            <div className={styles.supervisorName}>{supervisorName}</div>
                            <span className={styles.supervisorBadge}>◆ Supervisor</span>
                        </div>
                    </div>

                    <div className={styles.selectWrap}>
                        <label className={styles.selectLabel}>Currently supervising</label>
                        <select
                            className={styles.select}
                            value={selectedTeamId}
                            onChange={(e) => onSelectTeam(Number(e.target.value))}
                        >
                            {teams.map(({ team }) => (
                                <option key={team.team_id} value={team.team_id}>{team.project_title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selected && (
                    <div className={styles.statsStrip}>
                        <span className={styles.membersBadge}>
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                            </svg>
                            {selected.members.length} / {selected.team.max_users} Members
                        </span>
                        <span className={statusClass(selected.team.status || '')}>
                            {selected.team.status}
                        </span>
                        <span className={styles.countBadge}>
                            Supervising {teams.length} team{teams.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
