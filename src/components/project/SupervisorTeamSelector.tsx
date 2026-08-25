import type { Team, TeamMember } from '../../types/project';

export interface SupervisedTeamData {
    team: Team;
    members: TeamMember[];
}

interface SupervisorTeamSelectorProps {
    supervisorName: string;
    teams: SupervisedTeamData[];
    selectedTeamId: number;
    onSelectTeam: (teamId: number) => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    Active:     { bg: 'rgba(22,163,74,0.12)',   text: '#16a34a' },
    Recruiting: { bg: 'rgba(245,158,11,0.12)',  text: '#d97706' },
    Completed:  { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' },
};

export default function SupervisorTeamSelector({
    supervisorName, teams, selectedTeamId, onSelectTeam
}: SupervisorTeamSelectorProps) {
    const selected = teams.find(t => t.team.team_id === selectedTeamId);
    const statusStyle = STATUS_COLORS[selected?.team.status ?? ''] ?? { bg: 'rgba(107,114,128,0.1)', text: '#6b7280' };

    return (
        <div
            className="card border-0 mb-5 fade-up"
            style={{
                borderRadius: '1.25rem',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
                border: '1px solid rgba(99,102,241,0.18)',
                boxShadow: '0 8px 32px rgba(99,102,241,0.10)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}
        >
            <div className="card-body p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">

                    {/* ── Left: Supervisor identity ───────────────── */}
                    <div className="d-flex align-items-center gap-3">
                        {/* Avatar */}
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '14px',
                            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, boxShadow: '0 6px 18px rgba(124,58,237,0.35)'
                        }}>
                            <svg width="24" height="24" fill="white" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                            </svg>
                        </div>
                        <div>
                            <div className="fw-bolder" style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                                {supervisorName}
                            </div>
                            <span
                                className="badge fw-bold mt-1"
                                style={{
                                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                    color: '#fff',
                                    fontSize: '0.70rem',
                                    padding: '3px 10px',
                                    borderRadius: '999px',
                                    letterSpacing: '0.04em'
                                }}
                            >
                                ◆ Supervisor
                            </span>
                        </div>
                    </div>

                    {/* ── Right: Team selector ─────────────────────── */}
                    <div style={{ minWidth: '0', flexGrow: 1, maxWidth: '420px' }}>
                        <label
                            className="form-label fw-bold text-muted small text-uppercase mb-1"
                            style={{ letterSpacing: '0.06em', fontSize: '0.72rem' }}
                        >
                            Currently supervising
                        </label>
                        <select
                            className="form-select fw-semibold border-0 input-animated autofill-fix"
                            value={selectedTeamId}
                            onChange={(e) => onSelectTeam(Number(e.target.value))}
                            style={{ borderRadius: '0.8rem', fontSize: '0.92rem' }}
                        >
                            {teams.map(({ team }) => (
                                <option key={team.team_id} value={team.team_id}>
                                    {team.project_title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ── Stats strip ─────────────────────────────────── */}
                {selected && (
                    <div
                        className="d-flex flex-wrap gap-2 mt-4 pt-3"
                        style={{ borderTop: '1px solid rgba(99,102,241,0.15)' }}
                    >
                        {/* Members count */}
                        <span className="badge fw-semibold d-flex align-items-center gap-1"
                            style={{ background: 'rgba(37,99,235,0.10)', color: 'var(--brand)', borderRadius: '999px', padding: '5px 12px', fontSize: '0.78rem' }}>
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                            </svg>
                            {selected.members.length} / {selected.team.max_users} Members
                        </span>

                        {/* Status */}
                        <span className="badge fw-semibold"
                            style={{ background: statusStyle.bg, color: statusStyle.text, borderRadius: '999px', padding: '5px 12px', fontSize: '0.78rem' }}>
                            {selected.team.status}
                        </span>

                        {/* Total teams supervised */}
                        <span className="badge fw-semibold ms-auto"
                            style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed', borderRadius: '999px', padding: '5px 12px', fontSize: '0.78rem' }}>
                            Supervising {teams.length} team{teams.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
