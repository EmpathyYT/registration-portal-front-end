import type { Team, TeamMember, Reservation } from '../../types/project';

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

function statusClass(status: string) {
    const map: Record<string, string> = {
        Active:     'status-active',
        Recruiting: 'status-recruiting',
        Completed:  'status-completed',
    };
    return map[status] ?? 'status-default';
}

export default function SupervisorTeamSelector({ supervisorName, teams, selectedTeamId, onSelectTeam }: SupervisorTeamSelectorProps) {
    const selected = teams.find(t => t.team.team_id === selectedTeamId);

    return (
        <div className="card border-0 mb-5 fade-up supervisor-card">
            <div className="card-body p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="icon-box-sup">
                            <svg width="24" height="24" fill="white" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                            </svg>
                        </div>
                        <div>
                            <div className="fw-bolder supervisor-name">{supervisorName}</div>
                            <span className="badge fw-bold mt-1 badge-supervisor">◆ Supervisor</span>
                        </div>
                    </div>

                    <div className="team-select-wrap">
                        <label className="form-label fw-bold text-muted small section-label mb-1">Currently supervising</label>
                        <select
                            className="form-select fw-semibold border-0 input-animated autofill-fix team-select"
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
                    <div className="d-flex flex-wrap gap-2 mt-4 pt-3 stats-strip">
                        <span className="badge fw-semibold badge-stat badge-stat-blue">
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                            </svg>
                            {selected.members.length} / {selected.team.max_users} Members
                        </span>
                        <span className={`badge fw-semibold badge-stat ${statusClass(selected.team.status)}`}>
                            {selected.team.status}
                        </span>
                        <span className="badge fw-semibold badge-stat badge-stat-purple ms-auto">
                            Supervising {teams.length} team{teams.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
