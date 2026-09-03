import React, { useEffect, useState } from 'react';
import type { Team, TeamMember, Reservation } from '../../types/project';
import ReservationsFeed from './ReservationsFeed';
import { styles } from '../../styles/components/project/MyTeamPanelStyles';
import { teamsRepository } from '../../features/teams/repositories/teams_repository';
import type { UserEntity } from '../../features/auth/entities/user_entity';
import { supabase } from '../../core/supabaseClient';

/** Converts a raw storage path (e.g. "14/document.pdf") to a full public URL. */
function getDocUrl(path: string): string {
    const { data } = supabase.storage.from('team-documents').getPublicUrl(path);
    return data.publicUrl;
}

interface MyTeamPanelProps {
    team: Team;
    members: TeamMember[];
    reservations: Reservation[];
    currentUserId: string;
    onLeaveTeam: () => void;
    onInviteMember: () => void;
    onUpdateDoc: () => void;
    onManageMember: (member: TeamMember) => void;
    onBookReservation: () => void;
    onEditReservation: (r: Reservation) => void;
    onDeleteReservation: (r: Reservation) => void;
}

const Avatar = ({ name }: { name: string }) => {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return <div className="avatar-circle fw-bolder">{initials}</div>;
};

export const MyTeamPanel: React.FC<MyTeamPanelProps> = ({
    team, members, reservations, currentUserId,
    onLeaveTeam, onInviteMember, onUpdateDoc, onManageMember,
    onBookReservation, onEditReservation, onDeleteReservation,
}) => {
    const currentUser = members.find(m => m.user_id === currentUserId);
    const isTeamLeader = currentUser?.team_role === 'Team Leader';
    const isSupervisor = currentUserId === team.supervisor_id;
    const canManageMembers = isTeamLeader || isSupervisor;
    const canManageReservations = isTeamLeader || isSupervisor;
    const canEditDoc = isTeamLeader;
    const [isInvitingSupervisor, setIsInvitingSupervisor] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState('');
    const [isFetchingSupervisors, setIsFetchingSupervisors] = useState(false);
    const [supervisors, setSupervisors] = useState<UserEntity[]>([]);
    const [inviteState, setInviteState] = useState<'idle' | 'sending' | 'success'>('idle');

    const fetchSupervisors = async () => {
        setIsFetchingSupervisors(true);
        const fetchedSupervisors = await teamsRepository.getSupervisors();
        setSupervisors(fetchedSupervisors);
        setIsFetchingSupervisors(false);
    };

    const ensureSupervisorsLoaded = () => {
        if (supervisors.length === 0 && !isFetchingSupervisors) {
            fetchSupervisors();
        }
    };

    useEffect(() => {
        if (isInvitingSupervisor) {
            ensureSupervisorsLoaded();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInvitingSupervisor]);

    const handleSendSupervisorInvite = async () => {
        setInviteState('sending');
        await teamsRepository.sendInvitation(currentUserId, selectedSupervisor);
        setInviteState('success');
        setTimeout(() => {
            setIsInvitingSupervisor(false);
            setInviteState('idle');
            setSelectedSupervisor('');
        }, 1200);
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.icon}>
                        <svg width="22" height="22" fill="white" viewBox="0 0 16 16">
                            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z" />
                            <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                        </svg>
                    </div>
                    <div>
                        <span className={styles.badge}>
                            {isSupervisor ? '◆ Supervised Team' : 'Your Active Team'}
                        </span>
                        <h3 className={styles.title}>{team.project_title}</h3>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.leaveBtn} onClick={onLeaveTeam}>
                        {isSupervisor ? 'Stop Supervising' : 'Leave Team'}
                    </button>
                </div>
            </div>

            <div className={styles.body}>
                <ReservationsFeed
                    reservations={reservations}
                    canManage={canManageReservations}
                    onBook={onBookReservation}
                    onEdit={onEditReservation}
                    onDelete={onDeleteReservation}
                />

                <div className={styles.supervisorBox}>
                    <div>
                        <h6 className={styles.supervisorLabel}>Project Supervisor</h6>
                        <span className={styles.supervisorValue}>
                            {team.supervisor_id
                                ? (team.supervisor_name ?? `ID: ${team.supervisor_id}`)
                                : 'No supervisor assigned yet.'}
                        </span>
                    </div>
                    {!team.supervisor_id && isTeamLeader && (
                        isInvitingSupervisor ? (
                            <div className={styles.inviteWrap}>
                                {isFetchingSupervisors ? (
                                    <div className={`${styles.supervisorSelect} d-flex align-items-center gap-2 text-muted`}>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading supervisors...
                                    </div>
                                ) : (
                                    <select
                                        className={styles.supervisorSelect}
                                        value={selectedSupervisor}
                                        onChange={(e) => setSelectedSupervisor(e.target.value)}
                                        onFocus={ensureSupervisorsLoaded}
                                        disabled={inviteState !== 'idle'}
                                    >
                                        <option value="">Select Professor...</option>
                                        {supervisors.map((supervisor) => (
                                            <option key={supervisor.university_id} value={supervisor.university_id}>
                                                {supervisor.full_name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {!isFetchingSupervisors && selectedSupervisor !== '' && (
                                    <>
                                        <button
                                            className={styles.cancelBtn}
                                            onClick={() => { setIsInvitingSupervisor(false); setSelectedSupervisor(''); }}
                                            disabled={inviteState !== 'idle'}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className={styles.sendBtn(inviteState)}
                                            disabled={!selectedSupervisor || inviteState !== 'idle'}
                                            onClick={handleSendSupervisorInvite}
                                        >
                                            {inviteState === 'idle' && 'Send'}
                                            {inviteState === 'sending' && (<><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending</>)}
                                            {inviteState === 'success' && (<><svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" /></svg> Sent!</>)}
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <button
                                className={styles.inviteSupervisorBtn}
                                onClick={() => setIsInvitingSupervisor(true)}
                            >
                                Invite Supervisor
                            </button>
                        )
                    )}
                </div>

                <h6 className={styles.membersLabel}>Team Members</h6>
                <div className={styles.memberList}>
                    {members.map((member) => (
                        <div key={member.user_id} className={styles.memberRow}>
                            <Avatar name={member.full_name} />
                            <div className={styles.memberInfo}>
                                <h6 className={styles.memberName}>
                                    {member.full_name}
                                    {member.user_id === currentUserId && (
                                        <span className={styles.youBadge} style={{ fontSize: '0.65rem' }}>You</span>
                                    )}
                                </h6>
                                <span className={styles.memberId}>ID: {member.university_id}</span>
                            </div>
                            <div className={styles.memberRight}>
                                <span className={styles.roleBadge(member.team_role === 'Team Leader')}>{member.team_role}</span>
                                {canManageMembers && member.user_id !== currentUserId && (
                                    <button className={styles.manageBtn} onClick={() => onManageMember(member)}>Manage</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {members.length < team.max_users && (
                    <button className={styles.inviteMemberBtn} onClick={onInviteMember}>
                        + Invite New Member
                    </button>
                )}

                <div className={styles.docBox}>
                    <div>
                        <h6 className={styles.docLabel}>Project Documentation</h6>
                        <span className={styles.docValue}>
                            {team.introduction_link
                                ? 'Official document link is active.'
                                : canEditDoc
                                    ? 'No document link yet — add one below.'
                                    : 'No document link provided yet.'}
                        </span>
                    </div>
                    <div className={styles.docActions}>
                        {team.introduction_link && (
                            <a href={getDocUrl(team.introduction_link)} target="_blank" rel="noreferrer" className={styles.openLinkBtn}>
                                Open Link
                            </a>
                        )}
                        {canEditDoc && (
                            <button onClick={onUpdateDoc} className={styles.editLinkBtn}>
                                {team.introduction_link ? 'Edit Link' : 'Add Link'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTeamPanel;