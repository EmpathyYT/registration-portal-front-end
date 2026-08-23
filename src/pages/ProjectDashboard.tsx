import { useEffect, useState } from 'react';
import type { Team, TeamMember, Invitation } from '../types/project';
import MyTeamPanel from '../components/project/MyTeamPanel';
import AvailableTeamsGrid from '../components/project/AvailableTeamsGrid';
import InvitationsFeed from '../components/project/InvitationsFeed';
import ReservationModal from '../components/project/ReservationModal';
import InviteMemberModal from '../components/project/InviteMemberModal';
import UploadDocModal from '../components/project/UploadDocModal';
import CreateTeamModal from '../components/project/CreateTeamModal';
import ManageMemberModal from '../components/project/ManageMemberModal';
import PageMenu from '../components/layout/PageMenu';
import FloatingNotice, { type NoticeState } from '../components/layout/FloatingNotice';

const CURRENT_USER_ID = 'u1';

const MOCK_MY_TEAM: Team = {
    team_id: 1,
    Name: 'Alpha Tech',
    title: 'University Course Registration System',
    status: 'Active',
    min_users: 3,
    max_users: 4,
    introduction_link: 'https://docs.google.com/document/d/mock',
    This_Sem_Project_Id: 'PRJ-2026',
    supervisor_id: ''
};

const MOCK_TEAM_MEMBERS: TeamMember[] = [
    { team_id: 1, user_id: 'u1', full_name: 'Ammar Ahmad Sameed', university_id: '20221001', role: 'student', team_role: 'Team Leader' },
    { team_id: 1, user_id: 'u2', full_name: 'Basel', university_id: '20221002', role: 'student', team_role: 'Backend Dev' },
    { team_id: 1, user_id: 'u3', full_name: 'Mohammed', university_id: '20221003', role: 'student', team_role: 'Full Stack' },
];

const MOCK_AVAILABLE_TEAMS: Team[] = [
    { team_id: 2, Name: 'Beta Builders', title: 'AI Study Assistant', status: 'Recruiting', min_users: 1, max_users: 4, introduction_link: '', This_Sem_Project_Id: 'PRJ-2026', supervisor_id: 'sup-456' },
];

const MOCK_INVITATIONS: Invitation[] = [
    { team_id: 5, sender_user_id: 'u9', receiver_user_id: 'u1', created_at: '2026-08-15T10:00:00Z', team_name: 'Delta Force', status: 'PENDING', invitation_type: 'INVITE' },
    { team_id: 6, sender_user_id: 'u12', receiver_user_id: 'u1', created_at: '2026-08-16T09:30:00Z', team_name: 'Gamma Coders', status: 'PENDING', invitation_type: 'INVITE' },
    { team_id: 7, sender_user_id: 'u14', receiver_user_id: 'u1', created_at: '2026-08-17T12:45:00Z', team_name: 'Nova Stack', status: 'PENDING', invitation_type: 'INVITE' },
    { team_id: 8, sender_user_id: 'u15', receiver_user_id: 'u1', created_at: '2026-08-18T08:20:00Z', team_name: 'Vertex Labs', status: 'PENDING', invitation_type: 'INVITE' }
];

type ProjectDashboardProps = {
    onSwitchPage: () => void;
    onLogout: () => void;
};

export default function ProjectDashboard({ onSwitchPage, onLogout }: ProjectDashboardProps) {
    const [notice, setNotice] = useState<NoticeState>(null);
    const [hasTeam, setHasTeam] = useState<boolean>(true);
    const [myTeamData, setMyTeamData] = useState<Team>(MOCK_MY_TEAM);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);

    const [invitations, setInvitations] = useState<Invitation[]>(
        MOCK_INVITATIONS.filter(inv => inv.status === 'PENDING')
    );

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showSupervisorModal, setShowSupervisorModal] = useState(false);
    const [showDocModal, setShowDocModal] = useState(false);
    const [memberToManage, setMemberToManage] = useState<TeamMember | null>(null);

    useEffect(() => {
        if (!notice) return;
        const timeoutId = window.setTimeout(() => setNotice(null), 2600);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    const handleCreateTeam = (name: string, title: string) => {
        setMyTeamData({
            ...MOCK_MY_TEAM,
            Name: name,
            title: title,
            supervisor_id: ''
        });
        setTeamMembers([{ team_id: 1, user_id: CURRENT_USER_ID, full_name: 'Ammar Ahmad Sameed', university_id: '20221001', role: 'student', team_role: 'Team Leader' }]);
        setHasTeam(true);
        setShowCreateModal(false);
        setNotice({ type: 'success', message: `Team "${name}" was created.` });
    };

    const handleAcceptInvite = (team_id: number) => {
        setInvitations(invitations.filter(i => i.team_id !== team_id));
        setHasTeam(true);
        setNotice({ type: 'success', message: 'Invitation accepted.' });
    };

    const handleLeaveTeam = () => {
        if (window.confirm("Are you sure you want to leave this team?")) {
            setHasTeam(false);
            setNotice({ type: 'info', message: 'You left the team.' });
        }
    };

    const handleUpdateMemberRole = (userId: string, newRole: string) => {
        setTeamMembers(teamMembers.map(m => m.user_id === userId ? { ...m, team_role: newRole } : m));
        setMemberToManage(null);
        setNotice({ type: 'success', message: 'Member role updated.' });
    };

    const handlePromoteToLeader = (userId: string) => {
        setTeamMembers(teamMembers.map(m => {
            if (m.user_id === userId) return { ...m, team_role: 'Team Leader' };
            if (m.user_id === CURRENT_USER_ID) return { ...m, team_role: 'Member' };
            return m;
        }));
        setMemberToManage(null);
        setNotice({ type: 'success', message: 'Team leader changed.' });
    };

    const handleKickMember = (userId: string) => {
        if (window.confirm("Kick this member?")) {
            setTeamMembers(teamMembers.filter(m => m.user_id !== userId));
            setMemberToManage(null);
            setNotice({ type: 'success', message: 'Member removed from the team.' });
        }
    };

    const handleInviteSupervisor = (supervisorId: string) => {
        setMyTeamData({ ...myTeamData, supervisor_id: supervisorId });
        setShowSupervisorModal(false);
        setNotice({ type: 'success', message: 'Supervisor invited successfully.' });
    };

    return (
        <div className="min-vh-100 pb-5" style={{ paddingTop: '5.5rem' }}>
            <PageMenu switchLabel="Registration Page" onSwitchPage={onSwitchPage} onLogout={onLogout} />
            <FloatingNotice notice={notice} />
            <div className="container" style={{ maxWidth: '1100px' }}>
                <div className="text-center mb-5 fade-up">
                    
                    <h2 className="fw-bolder mb-1" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>Project Management</h2>
                    <p className="text-muted mb-0">Manage your team, invitations, and project documents.</p>
                </div>

                <div className="section-enter">
                    <InvitationsFeed
                        invitations={invitations}
                        onAccept={handleAcceptInvite}
                        onDecline={(teamId) => {
                            setInvitations(invitations.filter(i => i.team_id !== teamId));
                            setNotice({ type: 'info', message: 'Invitation declined.' });
                        }}
                    />
                </div>

                {hasTeam ? (
                    <div className="section-enter">
                        <MyTeamPanel
                            team={myTeamData}
                            members={teamMembers}
                            currentUserId={CURRENT_USER_ID}
                            onBookPresentation={() => setShowReservationModal(true)}
                            onLeaveTeam={handleLeaveTeam}
                            onInviteMember={() => setShowInviteModal(true)}
                            onUpdateDoc={() => setShowDocModal(true)}
                            onManageMember={(member) => setMemberToManage(member)}
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

                {showCreateModal && (
                    <CreateTeamModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreateTeam} />
                )}

                {showReservationModal && (
                    <ReservationModal
                        team={myTeamData}
                        onClose={() => setShowReservationModal(false)}
                        onSubmit={(loc) => { alert(`Booked ${loc}`); setShowReservationModal(false); }}
                    />
                )}

                {showInviteModal && (
                    <InviteMemberModal
                        onClose={() => setShowInviteModal(false)}
                        onSubmit={(id) => { alert(`Invited Student ${id}`); setShowInviteModal(false); }}
                    />
                )}

                {showSupervisorModal && (
                    <InviteMemberModal
                        onClose={() => setShowSupervisorModal(false)}
                        onSubmit={handleInviteSupervisor}
                    />
                )}

                {showDocModal && (
                    <UploadDocModal
                        currentLink={myTeamData.introduction_link}
                        onClose={() => setShowDocModal(false)}
                        onSubmit={(link) => { setMyTeamData({ ...myTeamData, introduction_link: link }); setShowDocModal(false); }}
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