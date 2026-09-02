import { useEffect, useState } from 'react';
import type { Team, TeamMember, Invitation, Reservation } from '../types/project';
import type { UserRole } from '../App';
import { authRepository } from '../features/auth/repositories/auth_repository';
import { teamsRepository } from '../features/teams/repositories/teams_repository';
import { reservationsRepository } from '../features/reservations/repositories/reservations_repository';
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
import type { TeamDto } from '../features/teams/dtos/team_dto';
import type { TeamMemberDto } from '../features/teams/dtos/team_member_dto';
import type { InvitationDto } from '../features/teams/dtos/invitation_dto';
import type { ReservationDto } from '../features/reservations/dtos/reservation_dto';

// --- DTO → local type mappers ---

function teamDtoToTeam(dto: TeamDto, supervisorName?: string): Team {
    return {
        team_id: dto.team_id,
        project_title: dto.project_title,
        status: dto.status as Team['status'],
        min_users: dto.min_users,
        max_users: dto.max_users,
        introduction_link: dto.introduction_link,
        supervisor_id: dto.supervisor_id,
        supervisor_name: supervisorName,
    };
}

function memberDtoToMember(dto: TeamMemberDto): TeamMember {
    return {
        team_id: dto.team_id,
        user_id: dto.user_id,
        full_name: dto.user_id, // full_name not available in TeamMemberDto; fallback to user_id
        university_id: '',       // university_id not available in TeamMemberDto
        team_role: dto.role,
    };
}

function invitationDtoToInvitation(dto: InvitationDto): Invitation {
    return {
        sender_user_id: dto.sender_user_id,
        receiver_user_id: dto.receiver_user_id,
        sender_full_name: dto.sender_user_id, // full_name not in InvitationDto; fallback to user_id
        sender_university_id: '',              // not available in InvitationDto
        created_at: dto.created_at,
        invitation_type: dto.invitation_type,
    };
}

function reservationDtoToReservation(dto: ReservationDto): Reservation {
    return {
        team_id: dto.team_id,
        location: dto.location,
        reservation_time: dto.reservation_time,
    };
}

// Join requests are stored as (sender=team_leader, receiver=student_applicant).
// We flip them so InvitationsFeed.onAccept(sender_user_id) receives the student's UUID.
function joinRequestDtoToInvitation(dto: InvitationDto): Invitation {
    return {
        sender_user_id: dto.receiver_user_id,   // student applicant
        receiver_user_id: dto.sender_user_id,   // team leader
        sender_full_name: dto.receiver_user_id, // fallback to UUID until backend adds JOIN
        sender_university_id: '',
        created_at: dto.created_at,
        invitation_type: dto.invitation_type,
    };
}

/** Fetch team reservation and return as array (repo returns single-or-null). */
async function fetchTeamReservations(teamId: number): Promise<Reservation[]> {
    const dto = await reservationsRepository.getTeamReservation(teamId);
    return dto ? [reservationDtoToReservation(dto)] : [];
}

type ProjectDashboardProps = {
    onSwitchPage?: () => void;
    onLogout: () => void;
    isDark: boolean;
    onToggleDark: () => void;
    userRole: UserRole;
};

export default function ProjectDashboard({ onSwitchPage, onLogout, isDark, onToggleDark, userRole }: ProjectDashboardProps) {
    const isSupervisor = userRole === 'supervisor';

    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState('');
    const [currentUserName, setCurrentUserName] = useState('');
    const [notice, setNotice] = useState<NoticeState>(null);

    const [hasTeam, setHasTeam] = useState(false);
    const [myTeamData, setMyTeamData] = useState<Team | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [joinRequests, setJoinRequests] = useState<Invitation[]>([]);

    const [supervisedTeams, setSupervisedTeams] = useState<SupervisedTeamData[]>([]);
    const [selectedSupTeamId, setSelectedSupTeamId] = useState<number | null>(null);
    const [unsupervisedTeams, setUnsupervisedTeams] = useState<Team[]>([]);

    const [showCreateModal, setShowCreateModal]     = useState(false);
    const [showInviteModal, setShowInviteModal]     = useState(false);
    const [showDocModal, setShowDocModal]           = useState(false);
    const [memberToManage, setMemberToManage]       = useState<TeamMember | null>(null);
    const [reservationToEdit, setReservationToEdit] = useState<Reservation | null | undefined>(null);

    const showNotice = (n: NoticeState) => setNotice(n);

    useEffect(() => {
        if (!notice) return;
        const id = window.setTimeout(() => setNotice(null), 2600);
        return () => window.clearTimeout(id);
    }, [notice]);

    useEffect(() => {
        async function load() {
            try {
                const session = await authRepository.getCurrentSession();
                if (!session) return;
                setCurrentUserId(session.user_id);
                setCurrentUserName(session.full_name);

                const inviteDtos = await teamsRepository.getPendingInvitations(session.user_id);
                setInvitations(inviteDtos.map(invitationDtoToInvitation));

                if (isSupervisor) {
                    const [supervisedDtos, unsupervisedDtos] = await Promise.all([
                        teamsRepository.getSupervisedTeams(session.user_id),
                        teamsRepository.getUnsupervisedTeams(),
                    ]);
                    const enriched: SupervisedTeamData[] = await Promise.all(
                        supervisedDtos.map(async (teamDto) => {
                            const [memberDtos, teamReservations] = await Promise.all([
                                teamsRepository.getTeamMembers(teamDto.team_id),
                                fetchTeamReservations(teamDto.team_id),
                            ]);
                            return {
                                team: teamDtoToTeam(teamDto),
                                members: memberDtos.map(memberDtoToMember),
                                reservations: teamReservations,
                            };
                        })
                    );
                    setSupervisedTeams(enriched);
                    setUnsupervisedTeams(unsupervisedDtos.map(dto => teamDtoToTeam(dto)));
                    if (enriched.length > 0) setSelectedSupTeamId(enriched[0].team.team_id);
                } else {
                    let teamDto = null;
                    try {
                        teamDto = await teamsRepository.getUserTeam(session.user_id);
                    } catch {
                        // Student has no team yet — .single() throws when 0 rows are found.
                        // Treat this as the normal "no team" state, not a fatal error.
                        teamDto = null;
                    }
                    if (teamDto) {
                        const team = teamDtoToTeam(teamDto);
                        setMyTeamData(team);
                        setHasTeam(true);
                        const [memberDtos, teamReservations] = await Promise.all([
                            teamsRepository.getTeamMembers(team.team_id),
                            fetchTeamReservations(team.team_id),
                        ]);
                        const members = memberDtos.map(memberDtoToMember);
                        setTeamMembers(members);
                        setReservations(teamReservations);

                        // If the current user is the team leader, fetch pending join requests.
                        const isLeader = members.some(
                            m => m.user_id === session.user_id && m.team_role === 'Team Leader'
                        );
                        if (isLeader) {
                            try {
                                const jrDtos = await teamsRepository.getPendingJoinRequests(team.team_id);
                                setJoinRequests(jrDtos.map(joinRequestDtoToInvitation));
                            } catch {
                                // Non-fatal — dashboard still works without join requests
                            }
                        }
                    } else {
                        const teamDtos = await teamsRepository.getAvailableTeams();
                        setAvailableTeams(teamDtos.map(dto => teamDtoToTeam(dto)));
                    }
                }
            } catch {
                showNotice({ type: 'error', message: 'Failed to load data. Check your connection.' });
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [isSupervisor]);

    const handleAcceptInvite = async (senderUserId: string) => {
        try {
            await teamsRepository.acceptInvitation(senderUserId, currentUserId);
            setInvitations(prev => prev.filter(i => i.sender_user_id !== senderUserId));
            if (!isSupervisor) {
                const teamDto = await teamsRepository.getUserTeam(currentUserId);
                if (teamDto) {
                    const team = teamDtoToTeam(teamDto);
                    setMyTeamData(team);
                    setHasTeam(true);
                    const [memberDtos, teamReservations] = await Promise.all([
                        teamsRepository.getTeamMembers(team.team_id),
                        fetchTeamReservations(team.team_id),
                    ]);
                    setTeamMembers(memberDtos.map(memberDtoToMember));
                    setReservations(teamReservations);
                }
            }
            showNotice({ type: 'success', message: 'Invitation accepted.' });
        } catch {
            showNotice({ type: 'error', message: 'Failed to accept invitation.' });
        }
    };

    const handleDeclineInvite = async (senderUserId: string) => {
        try {
            await teamsRepository.declineInvitation(senderUserId, currentUserId);
            setInvitations(prev => prev.filter(i => i.sender_user_id !== senderUserId));
            showNotice({ type: 'info', message: 'Invitation declined.' });
        } catch {
            showNotice({ type: 'error', message: 'Failed to decline invitation.' });
        }
    };

    const handleAcceptJoinRequest = async (applicantUserId: string) => {
        if (!myTeamData) return;
        try {
            await teamsRepository.acceptJoinRequest(applicantUserId, myTeamData.team_id);
            setJoinRequests(prev => prev.filter(r => r.sender_user_id !== applicantUserId));
            // Refresh members so the new member appears in the panel immediately.
            const memberDtos = await teamsRepository.getTeamMembers(myTeamData.team_id);
            setTeamMembers(memberDtos.map(memberDtoToMember));
            showNotice({ type: 'success', message: 'Join request accepted.' });
        } catch {
            showNotice({ type: 'error', message: 'Failed to accept join request.' });
        }
    };

    const handleDeclineJoinRequest = async (applicantUserId: string) => {
        if (!myTeamData) return;
        try {
            await teamsRepository.declineJoinRequest(applicantUserId, myTeamData.team_id);
            setJoinRequests(prev => prev.filter(r => r.sender_user_id !== applicantUserId));
            showNotice({ type: 'info', message: 'Join request declined.' });
        } catch {
            showNotice({ type: 'error', message: 'Failed to decline join request.' });
        }
    };

    const handleCreateTeam = async (projectTitle: string) => {
        try {
            const teamDto = await teamsRepository.createTeam(projectTitle);
            const team = teamDtoToTeam(teamDto);
            setMyTeamData(team);
            setHasTeam(true);
            const memberDtos = await teamsRepository.getTeamMembers(team.team_id);
            setTeamMembers(memberDtos.map(memberDtoToMember));
            setReservations([]);
            setShowCreateModal(false);
            showNotice({ type: 'success', message: `Team "${projectTitle}" created.` });
        } catch {
            showNotice({ type: 'error', message: 'Failed to create team.' });
        }
    };

    const handleJoinRequest = async (teamId: number) => {
        try {
            await teamsRepository.requestToJoinTeam(teamId);
            showNotice({ type: 'info', message: 'Join request sent.' });
        } catch {
            showNotice({ type: 'error', message: 'Failed to send join request.' });
        }
    };

    const handleLeaveTeam = async () => {
        if (!myTeamData || !window.confirm('Are you sure you want to leave this team?')) return;
        try {
            await teamsRepository.leaveTeam(currentUserId, myTeamData.team_id);
            setHasTeam(false);
            setMyTeamData(null);
            setTeamMembers([]);
            setReservations([]);
            const teamDtos = await teamsRepository.getAvailableTeams();
            setAvailableTeams(teamDtos.map(dto => teamDtoToTeam(dto)));
            showNotice({ type: 'info', message: 'You left the team.' });
        } catch {
            showNotice({ type: 'error', message: 'Failed to leave team.' });
        }
    };

    const handleStopSupervising = async () => {
        if (selectedSupTeamId === null) return;
        const activeTeam = supervisedTeams.find(t => t.team.team_id === selectedSupTeamId)?.team;
        if (!activeTeam || !window.confirm(`Stop supervising "${activeTeam.project_title}"?`)) return;
        try {
            await teamsRepository.stopSupervising(selectedSupTeamId);
            const remaining = supervisedTeams.filter(t => t.team.team_id !== selectedSupTeamId);
            const freed: Team = { ...activeTeam, supervisor_id: '', supervisor_name: undefined };
            setSupervisedTeams(remaining);
            setUnsupervisedTeams(prev => [...prev, freed]);
            setSelectedSupTeamId(remaining.length > 0 ? remaining[0].team.team_id : null);
            showNotice({ type: 'info', message: `Stopped supervising "${activeTeam.project_title}".` });
        } catch {
            showNotice({ type: 'error', message: 'Failed to stop supervising.' });
        }
    };

    const handleSuperviseTeam = async (teamId: number) => {
        try {
            await teamsRepository.setTeamSupervisor(teamId, currentUserId);
            const team = unsupervisedTeams.find(t => t.team_id === teamId);
            if (!team) return;
            const [memberDtos, teamReservations] = await Promise.all([
                teamsRepository.getTeamMembers(teamId),
                fetchTeamReservations(teamId),
            ]);
            const newEntry: SupervisedTeamData = {
                team: { ...team, supervisor_id: currentUserId, supervisor_name: currentUserName },
                members: memberDtos.map(memberDtoToMember),
                reservations: teamReservations,
            };
            setSupervisedTeams(prev => [...prev, newEntry]);
            setUnsupervisedTeams(prev => prev.filter(t => t.team_id !== teamId));
            setSelectedSupTeamId(teamId);
            showNotice({ type: 'success', message: `Now supervising "${team.project_title}".` });
        } catch {
            showNotice({ type: 'error', message: 'Failed to take supervision.' });
        }
    };

    const handleReservationSubmit = async (location: string, date: string) => {
        const activeTeam = getActiveTeam();
        if (!activeTeam) return;
        try {
            if (reservationToEdit) {
                await reservationsRepository.updatePresentation(activeTeam.team_id, reservationToEdit.reservation_time, location, date);
            } else {
                await reservationsRepository.bookPresentation(activeTeam.team_id, location, date);
            }
            const updated = await fetchTeamReservations(activeTeam.team_id);
            if (isSupervisor) {
                setSupervisedTeams(prev => prev.map(t =>
                    t.team.team_id === selectedSupTeamId ? { ...t, reservations: updated } : t
                ));
            } else {
                setReservations(updated);
            }
            setReservationToEdit(null);
            showNotice({ type: 'success', message: reservationToEdit ? 'Reservation updated.' : 'Reservation booked.' });
        } catch {
            showNotice({ type: 'error', message: 'Failed to save reservation.' });
        }
    };

    const handleDeleteReservation = async (r: Reservation) => {
        if (!window.confirm(`Delete reservation at ${r.location}?`)) return;
        try {
            await reservationsRepository.deletePresentation(r.team_id, r.reservation_time);
            if (isSupervisor) {
                setSupervisedTeams(prev => prev.map(t =>
                    t.team.team_id === selectedSupTeamId
                        ? { ...t, reservations: t.reservations.filter(x => x.reservation_time !== r.reservation_time) }
                        : t
                ));
            } else {
                setReservations(prev => prev.filter(x => x.reservation_time !== r.reservation_time));
            }
            showNotice({ type: 'info', message: 'Reservation deleted.' });
        } catch {
            showNotice({ type: 'error', message: 'Failed to delete reservation.' });
        }
    };

    const handleUpdateMemberRole = async (userId: string, newRole: string) => {
        const activeTeam = getActiveTeam();
        if (!activeTeam) return;
        try {
            await teamsRepository.updateMemberRole(activeTeam.team_id, userId, newRole);
            setActiveMembers(prev => prev.map(m => m.user_id === userId ? { ...m, team_role: newRole } : m));
            setMemberToManage(null);
            showNotice({ type: 'success', message: 'Member role updated.' });
        } catch {
            showNotice({ type: 'error', message: 'Failed to update role.' });
        }
    };

    const handlePromoteToLeader = async (userId: string) => {
        const activeTeam = getActiveTeam();
        if (!activeTeam) return;
        try {
            await teamsRepository.promoteToLeader(activeTeam.team_id, userId);
            setActiveMembers(prev => prev.map(m => {
                if (m.user_id === userId) return { ...m, team_role: 'Team Leader' };
                if (m.team_role === 'Team Leader') return { ...m, team_role: 'Member' };
                return m;
            }));
            setMemberToManage(null);
            showNotice({ type: 'success', message: 'Team leader changed.' });
        } catch {
            showNotice({ type: 'error', message: 'Failed to promote member.' });
        }
    };

    const handleKickMember = async (userId: string) => {
        const activeTeam = getActiveTeam();
        if (!activeTeam || !window.confirm('Remove this member from the team?')) return;
        try {
            await teamsRepository.kickMember(activeTeam.team_id, userId);
            setActiveMembers(prev => prev.filter(m => m.user_id !== userId));
            setMemberToManage(null);
            showNotice({ type: 'success', message: 'Member removed.' });
        } catch {
            showNotice({ type: 'error', message: 'Failed to remove member.' });
        }
    };

    const handleInviteMember = async (receiverUniId: string) => {
        try {
            await teamsRepository.sendInvitation(currentUserId, receiverUniId);
            setShowInviteModal(false);
            showNotice({ type: 'success', message: 'Invitation sent.' });
        } catch {
            showNotice({ type: 'error', message: 'Student not found or invite failed.' });
        }
    };

    const handleUpdateDoc = async (file: File): Promise<void> => {
        const activeTeam = getActiveTeam();
        if (!activeTeam) return;
        try {
            await teamsRepository.uploadTeamDocument(activeTeam.team_id, file);
            // Update local state with the filename as a presence marker so the UI
            // reflects the upload immediately without a full re-fetch.
            if (isSupervisor) {
                setSupervisedTeams(prev => prev.map(t =>
                    t.team.team_id === selectedSupTeamId ? { ...t, team: { ...t.team, introduction_link: file.name } } : t
                ));
            } else {
                setMyTeamData(prev => prev ? { ...prev, introduction_link: file.name } : prev);
            }
            setShowDocModal(false);
            showNotice({ type: 'success', message: 'Document uploaded successfully.' });
        } catch {
            showNotice({ type: 'error', message: 'Failed to upload document.' });
        }
    };

    const getActiveTeam = (): Team | null =>
        isSupervisor
            ? supervisedTeams.find(t => t.team.team_id === selectedSupTeamId)?.team ?? null
            : myTeamData;

    const getActiveMembers = (): TeamMember[] =>
        isSupervisor
            ? supervisedTeams.find(t => t.team.team_id === selectedSupTeamId)?.members ?? []
            : teamMembers;

    const getActiveReservations = (): Reservation[] =>
        isSupervisor
            ? supervisedTeams.find(t => t.team.team_id === selectedSupTeamId)?.reservations ?? []
            : reservations;

    const setActiveMembers = (updater: (prev: TeamMember[]) => TeamMember[]) => {
        if (isSupervisor) {
            setSupervisedTeams(prev => prev.map(t =>
                t.team.team_id === selectedSupTeamId ? { ...t, members: updater(t.members) } : t
            ));
        } else {
            setTeamMembers(prev => updater(prev));
        }
    };

    const activeTeam         = getActiveTeam();
    const activeMembers      = getActiveMembers();
    const activeReservations = getActiveReservations();
    const showReservationModal = reservationToEdit !== null;

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 pb-5 page-body">
            <PageMenu
                switchLabel="Registration Portal"
                onSwitchPage={onSwitchPage}
                onLogout={onLogout}
                isDark={isDark}
                onToggleDark={onToggleDark}
                userRole={userRole}
            />
            <FloatingNotice notice={notice} />

            <div className="container container-main">

                {isSupervisor ? (
                    <>
                        {supervisedTeams.length > 0 && (
                            <div className="section-enter">
                                <SupervisorTeamSelector
                                    supervisorName={currentUserName}
                                    teams={supervisedTeams}
                                    selectedTeamId={selectedSupTeamId!}
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

                        {supervisedTeams.length > 0 && activeTeam ? (
                            <div className="section-enter">
                                <MyTeamPanel
                                    key={selectedSupTeamId}
                                    team={activeTeam}
                                    members={activeMembers}
                                    reservations={activeReservations}
                                    currentUserId={currentUserId}
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

                        {/* Join requests — only visible to team leaders */}
                        {hasTeam && teamMembers.some(m => m.user_id === currentUserId && m.team_role === 'Team Leader') && (
                            <div className="section-enter">
                                <InvitationsFeed
                                    title="Pending Join Requests"
                                    invitations={joinRequests}
                                    onAccept={handleAcceptJoinRequest}
                                    onDecline={handleDeclineJoinRequest}
                                />
                            </div>
                        )}

                        {hasTeam && myTeamData ? (
                            <div className="section-enter">
                                <MyTeamPanel
                                    team={myTeamData}
                                    members={teamMembers}
                                    reservations={reservations}
                                    currentUserId={currentUserId}
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
                                    teams={availableTeams}
                                    onJoinRequest={handleJoinRequest}
                                    onCreateTeam={() => setShowCreateModal(true)}
                                />
                            </div>
                        )}
                    </>
                )}

                {showCreateModal && (
                    <CreateTeamModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreateTeam} />
                )}
                {showReservationModal && activeTeam && (
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
                        onSubmit={handleInviteMember}
                    />
                )}
                {showDocModal && activeTeam && (
                    <UploadDocModal
                        currentLink={activeTeam.introduction_link || undefined}
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