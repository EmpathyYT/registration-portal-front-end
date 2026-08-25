import { useEffect, useState } from 'react';
import type { Team, TeamMember, Invitation, Reservation } from '../types/project';
import type { UserRole } from '../App';
import MyTeamPanel from '../components/project/MyTeamPanel';
import AvailableTeamsGrid from '../components/project/AvailableTeamsGrid';
import InvitationsFeed from '../components/project/InvitationsFeed';
import ReservationModal from '../components/project/ReservationModal';
import InviteMemberModal from '../components/project/InviteMemberModal';
import UploadDocModal from '../components/project/UploadDocModal';
import CreateTeamModal from '../components/project/CreateTeamModal';
import ManageMemberModal from '../components/project/ManageMemberModal';
import SupervisorTeamSelector, { type SupervisedTeamData } from '../components/project/SupervisorTeamSelector';
import PageMenu from '../components/layout/PageMenu';
import FloatingNotice, { type NoticeState } from '../components/layout/FloatingNotice';

// ─── STUDENT MOCK DATA ─────────────────────────────────────────
// Query: SELECT teams.*, users.full_name AS supervisor_name
//        FROM teams LEFT JOIN users ON users.id = teams.supervisor_id
//        WHERE team_members.user_id = $studentId
const STUDENT_USER_ID = 'u1';

const MOCK_MY_TEAM: Team = {
    team_id: 1,
    project_title: 'University Course Registration System',
    status: 'Active',
    min_users: 3,
    max_users: 4,
    introduction_link: 'https://docs.google.com/document/d/mock',
    supervisor_id: 'sup1',
    supervisor_name: 'Dr. Mohammed Ali',
};

const MOCK_TEAM_MEMBERS: TeamMember[] = [
    { team_id: 1, user_id: 'u1', full_name: 'Ammar Ahmad Sameed', university_id: '20221001', role: 'student', team_role: 'Team Leader' },
    { team_id: 1, user_id: 'u2', full_name: 'Basel Ibrahim',      university_id: '20221002', role: 'student', team_role: 'Backend Dev' },
    { team_id: 1, user_id: 'u3', full_name: 'Mohammed Khalid',    university_id: '20221003', role: 'student', team_role: 'Full Stack' },
];

// Query: SELECT * FROM reservations WHERE team_id = $teamId
const MOCK_RESERVATIONS: Reservation[] = [
    { team_id: 1, location: 'Hall A', reservation_time: '2026-09-15T10:00:00Z' },
    { team_id: 1, location: 'Lab 101', reservation_time: '2026-09-22T14:00:00Z' },
];

const MOCK_AVAILABLE_TEAMS: Team[] = [
    { team_id: 2, project_title: 'AI Study Assistant', status: 'Recruiting', min_users: 1, max_users: 4, introduction_link: '', supervisor_id: '' },
];

// Query: SELECT invitations.*, users.full_name AS sender_full_name, users.university_id AS sender_university_id
//        FROM invitations JOIN users ON users.id = invitations.sender_user_id
//        WHERE invitations.receiver_user_id = $studentId
const MOCK_STUDENT_INVITATIONS: Invitation[] = [
    { sender_user_id: 'u9',  receiver_user_id: 'u1', created_at: '2026-08-15T10:00:00Z', sender_full_name: 'Yousef Al-Ahmad', sender_university_id: '20221009' },
    { sender_user_id: 'u12', receiver_user_id: 'u1', created_at: '2026-08-16T09:30:00Z', sender_full_name: 'Nour Khalil',      sender_university_id: '20221012' },
    { sender_user_id: 'u14', receiver_user_id: 'u1', created_at: '2026-08-17T12:45:00Z', sender_full_name: 'Rana Ibrahim',     sender_university_id: '20221014' },
    { sender_user_id: 'u15', receiver_user_id: 'u1', created_at: '2026-08-18T08:20:00Z', sender_full_name: 'Tariq Al-Masri',  sender_university_id: '20221015' },
];

// ─── SUPERVISOR MOCK DATA ──────────────────────────────────────
const SUPERVISOR_USER_ID = 'sup1';
const SUPERVISOR_NAME = 'Dr. Mohammed Ali';

const MOCK_SUPERVISOR_INVITATIONS: Invitation[] = [
    { sender_user_id: 'u4', receiver_user_id: 'sup1', created_at: '2026-08-19T11:00:00Z', sender_full_name: 'Sara Al-Masri', sender_university_id: '20221004' },
    { sender_user_id: 'u6', receiver_user_id: 'sup1', created_at: '2026-08-20T14:30:00Z', sender_full_name: 'Ahmad Yousef',  sender_university_id: '20221006' },
];

// Query: SELECT teams.*, users.full_name AS supervisor_name
//        FROM teams LEFT JOIN users ON users.id = teams.supervisor_id
//        WHERE teams.supervisor_id = $supervisorId
// Note: status ('Active'/'Recruiting') comes from teams.status (project_status enum in DB)
const MOCK_SUPERVISED_TEAMS: SupervisedTeamData[] = [
    {
        team: { team_id: 1, project_title: 'University Course Registration System', status: 'Active', min_users: 3, max_users: 4, introduction_link: 'https://docs.google.com/document/d/mock1', supervisor_id: SUPERVISOR_USER_ID, supervisor_name: SUPERVISOR_NAME },
        members: [
            { team_id: 1, user_id: 'u1', full_name: 'Ammar Ahmad Sameed', university_id: '20221001', role: 'student', team_role: 'Team Leader' },
            { team_id: 1, user_id: 'u2', full_name: 'Basel Ibrahim',       university_id: '20221002', role: 'student', team_role: 'Backend Dev' },
            { team_id: 1, user_id: 'u3', full_name: 'Mohammed Khalid',     university_id: '20221003', role: 'student', team_role: 'Full Stack' },
        ],
        reservations: [
            { team_id: 1, location: 'Hall B', reservation_time: '2026-09-18T09:00:00Z' },
        ],
    },
    {
        team: { team_id: 2, project_title: 'AI-Powered Study Assistant', status: 'Active', min_users: 2, max_users: 4, introduction_link: '', supervisor_id: SUPERVISOR_USER_ID, supervisor_name: SUPERVISOR_NAME },
        members: [
            { team_id: 2, user_id: 'u4', full_name: 'Sara Al-Masri', university_id: '20221004', role: 'student', team_role: 'Team Leader' },
            { team_id: 2, user_id: 'u5', full_name: 'Khalid Nasser',  university_id: '20221005', role: 'student', team_role: 'Frontend Dev' },
        ],
        reservations: [],
    },
    {
        team: { team_id: 3, project_title: 'Smart Campus Navigation System', status: 'Recruiting', min_users: 4, max_users: 5, introduction_link: '', supervisor_id: SUPERVISOR_USER_ID, supervisor_name: SUPERVISOR_NAME },
        members: [
            { team_id: 3, user_id: 'u6', full_name: 'Ahmad Yousef', university_id: '20221006', role: 'student', team_role: 'Team Leader' },
            { team_id: 3, user_id: 'u7', full_name: 'Lina Hamdan',  university_id: '20221007', role: 'student', team_role: 'Backend Dev' },
            { team_id: 3, user_id: 'u8', full_name: 'Omar Saleh',   university_id: '20221008', role: 'student', team_role: 'Frontend Dev' },
            { team_id: 3, user_id: 'u9', full_name: 'Rami Aziz',    university_id: '20221009', role: 'student', team_role: 'Mobile Dev' },
        ],
        reservations: [],
    },
];

// Query: SELECT * FROM teams WHERE supervisor_id IS NULL
const MOCK_UNSUPERVISED_TEAMS: Team[] = [
    { team_id: 10, project_title: 'Mobile Banking App',         status: 'Recruiting', min_users: 1, max_users: 4, introduction_link: '', supervisor_id: '' },
    { team_id: 11, project_title: 'E-Learning Platform',        status: 'Active',     min_users: 2, max_users: 5, introduction_link: '', supervisor_id: '' },
    { team_id: 12, project_title: 'Hospital Management System', status: 'Recruiting', min_users: 2, max_users: 4, introduction_link: '', supervisor_id: '' },
];

// ─── COMPONENT ────────────────────────────────────────────────
type ProjectDashboardProps = {
    onSwitchPage?: () => void;
    onLogout: () => void;
    isDark: boolean;
    onToggleDark: () => void;
    userRole: UserRole;
};

export default function ProjectDashboard({ onSwitchPage, onLogout, isDark, onToggleDark, userRole }: ProjectDashboardProps) {
    const isSupervisor = userRole === 'supervisor';

    const [notice, setNotice] = useState<NoticeState>(null);

    // Student state
    const [hasTeam, setHasTeam] = useState(true);
    const [myTeamData, setMyTeamData] = useState<Team>(MOCK_MY_TEAM);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
    const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);

    // Invitations
    const [invitations, setInvitations] = useState<Invitation[]>(
        isSupervisor ? MOCK_SUPERVISOR_INVITATIONS : MOCK_STUDENT_INVITATIONS
    );

    // Supervisor state
    const [supervisedTeams, setSupervisedTeams] = useState<SupervisedTeamData[]>(MOCK_SUPERVISED_TEAMS);
    const [selectedSupTeamId, setSelectedSupTeamId] = useState<number>(MOCK_SUPERVISED_TEAMS[0].team.team_id);
    const [unsupervisedTeams, setUnsupervisedTeams] = useState<Team[]>(MOCK_UNSUPERVISED_TEAMS);

    // Modal state
    const [showCreateModal, setShowCreateModal]       = useState(false);
    const [showInviteModal, setShowInviteModal]       = useState(false);
    const [showDocModal, setShowDocModal]             = useState(false);
    const [memberToManage, setMemberToManage]         = useState<TeamMember | null>(null);
    // Reservation modal — null = closed, undefined = create mode, Reservation = edit mode
    const [reservationToEdit, setReservationToEdit]   = useState<Reservation | null | undefined>(null);

    useEffect(() => {
        if (!notice) return;
        const id = window.setTimeout(() => setNotice(null), 2600);
        return () => window.clearTimeout(id);
    }, [notice]);

    // ── Invitation handlers ────────────────────────────────────
    const handleAcceptInvite = (senderUserId: string) => {
        setInvitations(prev => prev.filter(i => i.sender_user_id !== senderUserId));
        if (!isSupervisor) setHasTeam(true);
        setNotice({ type: 'success', message: 'Invitation accepted.' });
    };
    const handleDeclineInvite = (senderUserId: string) => {
        setInvitations(prev => prev.filter(i => i.sender_user_id !== senderUserId));
        setNotice({ type: 'info', message: 'Invitation declined.' });
    };

    // ── Student handlers ───────────────────────────────────────
    const handleCreateTeam = (projectTitle: string) => {
        setMyTeamData({ ...MOCK_MY_TEAM, project_title: projectTitle, supervisor_id: '', supervisor_name: undefined });
        setTeamMembers([{ team_id: 1, user_id: STUDENT_USER_ID, full_name: 'Ammar Ahmad Sameed', university_id: '20221001', role: 'student', team_role: 'Team Leader' }]);
        setReservations([]);
        setHasTeam(true);
        setShowCreateModal(false);
        setNotice({ type: 'success', message: `Team "${projectTitle}" created.` });
    };
    const handleLeaveTeam = () => {
        if (window.confirm('Are you sure you want to leave this team?')) {
            setHasTeam(false);
            setNotice({ type: 'info', message: 'You left the team.' });
        }
    };

    // ── Supervisor: stop supervising ───────────────────────────
    // Simulates: UPDATE teams SET supervisor_id = NULL WHERE id = $teamId
    const handleStopSupervising = () => {
        const title = getActiveTeam().project_title;
        if (window.confirm(`Stop supervising "${title}"?`)) {
            const remaining = supervisedTeams.filter(t => t.team.team_id !== selectedSupTeamId);
            const freedTeam: Team = { ...getActiveTeam(), supervisor_id: '', supervisor_name: undefined };
            setUnsupervisedTeams(prev => [...prev, freedTeam]);
            setSupervisedTeams(remaining);
            if (remaining.length > 0) setSelectedSupTeamId(remaining[0].team.team_id);
            setMemberToManage(null);
            setNotice({ type: 'info', message: `Stopped supervising "${title}".` });
        }
    };

    // ── Supervisor: take supervision of a team ─────────────────
    // Simulates: UPDATE teams SET supervisor_id = $supervisorId WHERE id = $teamId
    const handleSuperviseTeam = (teamId: number) => {
        const team = unsupervisedTeams.find(t => t.team_id === teamId);
        if (!team) return;
        const newEntry: SupervisedTeamData = {
            team: { ...team, supervisor_id: SUPERVISOR_USER_ID, supervisor_name: SUPERVISOR_NAME },
            members: [],
            reservations: [],
        };
        setSupervisedTeams(prev => [...prev, newEntry]);
        setUnsupervisedTeams(prev => prev.filter(t => t.team_id !== teamId));
        setSelectedSupTeamId(teamId);
        setNotice({ type: 'success', message: `Now supervising "${team.project_title}".` });
    };

    // ── Reservation CRUD ───────────────────────────────────────
    // Simulates: INSERT INTO reservations (team_id, location, reservation_time) VALUES (...)
    // or:        UPDATE reservations SET ... WHERE team_id = ... AND reservation_time = ...
    const handleReservationSubmit = (location: string, date: string) => {
        const newR: Reservation = { team_id: getActiveTeam().team_id, location, reservation_time: date };

        if (isSupervisor) {
            setSupervisedTeams(prev => prev.map(t => {
                if (t.team.team_id !== selectedSupTeamId) return t;
                const existingTime = reservationToEdit?.reservation_time;
                const updated = existingTime
                    ? t.reservations.map(r => r.reservation_time === existingTime ? newR : r)
                    : [...t.reservations, newR];
                return { ...t, reservations: updated };
            }));
        } else {
            const existingTime = reservationToEdit?.reservation_time;
            setReservations(prev => existingTime
                ? prev.map(r => r.reservation_time === existingTime ? newR : r)
                : [...prev, newR]
            );
        }
        setReservationToEdit(null);
        setNotice({ type: 'success', message: reservationToEdit ? 'Reservation updated.' : 'Reservation booked.' });
    };

    // Simulates: DELETE FROM reservations WHERE team_id = ... AND reservation_time = ...
    const handleDeleteReservation = (r: Reservation) => {
        if (!window.confirm(`Delete reservation at ${r.location}?`)) return;
        if (isSupervisor) {
            setSupervisedTeams(prev => prev.map(t =>
                t.team.team_id === selectedSupTeamId
                    ? { ...t, reservations: t.reservations.filter(x => x.reservation_time !== r.reservation_time) }
                    : t
            ));
        } else {
            setReservations(prev => prev.filter(x => x.reservation_time !== r.reservation_time));
        }
        setNotice({ type: 'info', message: 'Reservation deleted.' });
    };

    // ── Shared member handlers ─────────────────────────────────
    const getActiveTeam = (): Team =>
        isSupervisor ? supervisedTeams.find(t => t.team.team_id === selectedSupTeamId)?.team ?? MOCK_MY_TEAM : myTeamData;

    const getActiveMembers = (): TeamMember[] =>
        isSupervisor ? supervisedTeams.find(t => t.team.team_id === selectedSupTeamId)?.members ?? [] : teamMembers;

    const getActiveReservations = (): Reservation[] =>
        isSupervisor ? supervisedTeams.find(t => t.team.team_id === selectedSupTeamId)?.reservations ?? [] : reservations;

    const setActiveMembers = (updater: (prev: TeamMember[]) => TeamMember[]) => {
        if (isSupervisor) {
            setSupervisedTeams(prev => prev.map(t =>
                t.team.team_id === selectedSupTeamId ? { ...t, members: updater(t.members) } : t
            ));
        } else {
            setTeamMembers(prev => updater(prev));
        }
    };

    const handleUpdateMemberRole = (userId: string, newRole: string) => {
        setActiveMembers(prev => prev.map(m => m.user_id === userId ? { ...m, team_role: newRole } : m));
        setMemberToManage(null);
        setNotice({ type: 'success', message: 'Member role updated.' });
    };
    const handlePromoteToLeader = (userId: string) => {
        setActiveMembers(prev => prev.map(m => {
            if (m.user_id === userId) return { ...m, team_role: 'Team Leader' };
            if (m.team_role === 'Team Leader') return { ...m, team_role: 'Member' };
            return m;
        }));
        setMemberToManage(null);
        setNotice({ type: 'success', message: 'Team leader changed.' });
    };
    const handleKickMember = (userId: string) => {
        if (window.confirm('Remove this member from the team?')) {
            setActiveMembers(prev => prev.filter(m => m.user_id !== userId));
            setMemberToManage(null);
            setNotice({ type: 'success', message: 'Member removed.' });
        }
    };
    const handleUpdateDoc = (link: string) => {
        if (isSupervisor) {
            setSupervisedTeams(prev => prev.map(t =>
                t.team.team_id === selectedSupTeamId ? { ...t, team: { ...t.team, introduction_link: link } } : t
            ));
        } else {
            setMyTeamData(prev => ({ ...prev, introduction_link: link }));
        }
        setShowDocModal(false);
    };

    // ── Render ────────────────────────────────────────────────
    const activeTeam        = getActiveTeam();
    const activeMembers     = getActiveMembers();
    const activeReservations = getActiveReservations();
    const showReservationModal = reservationToEdit !== null; // null = closed, undefined or Reservation = open

    return (
        <div className="min-vh-100 pb-5" style={{ paddingTop: '5.5rem' }}>
            <PageMenu
                switchLabel="Registration Page"
                onSwitchPage={onSwitchPage}
                onLogout={onLogout}
                isDark={isDark}
                onToggleDark={onToggleDark}
            />
            <FloatingNotice notice={notice} />

            <div className="container" style={{ maxWidth: '1100px' }}>

                {isSupervisor ? (
                    /* ══ SUPERVISOR VIEW ═══════════════════════ */
                    <>
                        {supervisedTeams.length > 0 && (
                            <div className="section-enter">
                                <SupervisorTeamSelector
                                    supervisorName={SUPERVISOR_NAME}
                                    teams={supervisedTeams}
                                    selectedTeamId={selectedSupTeamId}
                                    onSelectTeam={(id) => { setSelectedSupTeamId(id); setMemberToManage(null); }}
                                />
                            </div>
                        )}

                        <div className="section-enter">
                            <InvitationsFeed
                                invitations={invitations}
                                onAccept={handleAcceptInvite}
                                onDecline={handleDeclineInvite}
                            />
                        </div>

                        {supervisedTeams.length > 0 ? (
                            <div className="section-enter">
                                <MyTeamPanel
                                    key={selectedSupTeamId}
                                    team={activeTeam}
                                    members={activeMembers}
                                    reservations={activeReservations}
                                    currentUserId={SUPERVISOR_USER_ID}
                                    onLeaveTeam={handleStopSupervising}
                                    onInviteMember={() => setShowInviteModal(true)}
                                    onUpdateDoc={() => setShowDocModal(true)}
                                    onManageMember={setMemberToManage}
                                    onBookReservation={() => setReservationToEdit(undefined)}
                                    onEditReservation={(r) => setReservationToEdit(r)}
                                    onDeleteReservation={handleDeleteReservation}
                                />
                            </div>
                        ) : (
                            <div className="section-enter mb-4">
                                <div className="alert border-0 shadow-sm rounded-4 p-5 text-center">
                                    <h5 className="text-muted fw-bold mb-1">Not supervising any teams.</h5>
                                    <p className="text-muted mb-0 small">Browse teams below and click "Supervise This Team".</p>
                                </div>
                            </div>
                        )}

                        <div className="section-enter">
                            <AvailableTeamsGrid
                                teams={unsupervisedTeams}
                                title="Teams Without Supervisor"
                                actionLabel="Supervise This Team"
                                showCreate={false}
                                onJoinRequest={handleSuperviseTeam}
                            />
                        </div>
                    </>
                ) : (
                    /* ══ STUDENT VIEW ══════════════════════════ */
                    <>
                        <div className="text-center mb-5 fade-up">
                            <h2 className="fw-bolder mb-1 page-title" style={{ letterSpacing: '-0.5px' }}>
                                Project Management
                            </h2>
                            <p className="text-muted mb-0">Manage your team, invitations, and project documents.</p>
                        </div>

                        <div className="section-enter">
                            <InvitationsFeed
                                invitations={invitations}
                                onAccept={handleAcceptInvite}
                                onDecline={handleDeclineInvite}
                            />
                        </div>

                        {hasTeam ? (
                            <div className="section-enter">
                                <MyTeamPanel
                                    team={myTeamData}
                                    members={teamMembers}
                                    reservations={reservations}
                                    currentUserId={STUDENT_USER_ID}
                                    onLeaveTeam={handleLeaveTeam}
                                    onInviteMember={() => setShowInviteModal(true)}
                                    onUpdateDoc={() => setShowDocModal(true)}
                                    onManageMember={setMemberToManage}
                                    onBookReservation={() => setReservationToEdit(undefined)}
                                    onEditReservation={(r) => setReservationToEdit(r)}
                                    onDeleteReservation={handleDeleteReservation}
                                />
                            </div>
                        ) : (
                            <div className="section-enter">
                                <AvailableTeamsGrid
                                    teams={MOCK_AVAILABLE_TEAMS}
                                    onJoinRequest={(id) => setNotice({ type: 'info', message: `Join request sent to team ${id}.` })}
                                    onCreateTeam={() => setShowCreateModal(true)}
                                />
                            </div>
                        )}
                    </>
                )}

                {/* ── Modals ─────────────────────────────────── */}
                {showCreateModal && (
                    <CreateTeamModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreateTeam} />
                )}
                {showReservationModal && (
                    <ReservationModal
                        team={activeTeam}
                        existing={reservationToEdit ?? undefined}
                        onClose={() => setReservationToEdit(null)}
                        onSubmit={handleReservationSubmit}
                    />
                )}
                {showInviteModal && (
                    <InviteMemberModal
                        onClose={() => setShowInviteModal(false)}
                        onSubmit={(id) => { alert(`Invited: ${id}`); setShowInviteModal(false); }}
                    />
                )}
                {showDocModal && (
                    <UploadDocModal
                        currentLink={activeTeam.introduction_link}
                        onClose={() => setShowDocModal(false)}
                        onSubmit={handleUpdateDoc}
                    />
                )}
                {memberToManage && (
                    <ManageMemberModal
                        member={memberToManage}
                        onClose={() => setMemberToManage(null)}
                        onUpdateRole={handleUpdateMemberRole}
                        onPromoteToLeader={handlePromoteToLeader}
                        onKick={handleKickMember}
                    />
                )}
            </div>
        </div>
    );
}