import { TeamsDataSource } from './teams_data_source';
import { TeamDto } from '../dtos/team_dto';
import { TeamMemberDto } from '../dtos/team_member_dto';
import { InvitationDto } from '../dtos/invitation_dto';
import type { TeamEntity } from '../entities/team_entity';
import type { TeamMemberEntity } from '../entities/team_member_entity';
import type { InvitationEntity } from '../entities/invitation_entity';
import type { UserEntity } from '../../auth/entities/user_entity';
import { authRepository } from '../../auth/repositories/auth_repository';

/** Test user pool: "you" (user1, matches MockAuthDataSource's fixed session id) plus 6 others. */
const MOCK_USERS: UserEntity[] = [
    { id: 'user1', full_name: 'Ammar Ahmad Sameed', university_id: '20221001', role: 'student' },
    { id: 'user2', full_name: 'Basel Odeh', university_id: '20221002', role: 'student' },
    { id: 'user3', full_name: 'Mohammed Nasser', university_id: '20221003', role: 'student' },
    { id: 'user4', full_name: 'Lana Youssef', university_id: '20221004', role: 'student' },
    { id: 'user5', full_name: 'Sara Kamal', university_id: '20221005', role: 'student' },
    { id: 'user6', full_name: 'Omar Fares', university_id: '20221006', role: 'student' },
    { id: 'user7', full_name: 'Dana Khalil', university_id: '20221007', role: 'student' },
    { id: 'teacher1', full_name: 'Dr. Rania Mahmoud', university_id: '10001001', role: 'teacher' },
];

const MOCK_TEAMS: TeamEntity[] = [
    {
        id: 1,
        min_users: 3,
        max_users: 5,
        project_title: 'Smart Campus App',
        status: 'approved',
        introduction_link: null,
        supervisor_id: null,
    },
];

const MOCK_TEAM_MEMBERS: TeamMemberEntity[] = [
    { team_id: 1, user_id: 'user2', role: 'Team Leader' },
    { team_id: 1, user_id: 'user3', role: 'Backend Dev' },
    { team_id: 1, user_id: 'user4', role: 'Frontend Dev' },
];

/** "You" (user1) always start with a pending invite to join the Smart Campus App team. */
const MOCK_INVITATIONS: InvitationEntity[] = [
    { sender_user_id: 'user2', receiver_user_id: 'user1', created_at: new Date().toISOString(), invitation_type: 'invite' },
    { sender_user_id: 'user7', receiver_user_id: 'user2', created_at: new Date().toISOString(), invitation_type: 'join_request' },
];

/** Appending "aj" to the university id you're inviting skips the pending invite and joins them immediately. */
const AUTO_JOIN_SUFFIX = 'aj';

/**
 * In-memory mock implementation of TeamsDataSource.
 * Backed by a small fixed pool of test users, plus module-level arrays for
 * teams, team_members and invitations mirroring the real tables.
 */
export class MockTeamsDataSource extends TeamsDataSource {
    private readonly teams: TeamEntity[] = MOCK_TEAMS;
    private readonly teamMembers: TeamMemberEntity[] = MOCK_TEAM_MEMBERS;
    private readonly invitations: InvitationEntity[] = MOCK_INVITATIONS;

    private findUserByUniId(universityId: string): UserEntity | undefined {
        return MOCK_USERS.find((u) => u.university_id === universityId);
    }

    private findMembership(userId: string): TeamMemberEntity | undefined {
        return this.teamMembers.find((m) => m.user_id === userId);
    }

    private findLeader(teamId: number): TeamMemberEntity | undefined {
        return this.teamMembers.find((m) => m.team_id === teamId && m.role === 'Team Leader');
    }

    private addMember(teamId: number, userId: string, role: string): void {
        if (this.findMembership(userId)) {
            throw new Error('User already belongs to a team');
        }
        this.teamMembers.push({ team_id: teamId, user_id: userId, role });
    }

    async getAvailableTeams(): Promise<TeamDto[]> {
        return this.teams.map((team) => TeamDto.fromEntity(team));
    }

    async createTeam(projectTitle: string): Promise<TeamDto> {

        const nextId = this.teams.reduce((max, t) => Math.max(max, t.id), 0) + 1;
        const team: TeamEntity = {
            id: nextId,
            min_users: 3,
            max_users: 5,
            project_title: projectTitle,
            status: 'pending',
            introduction_link: null,
            supervisor_id: null,
        };
        const currentUser = (await authRepository.getCurrentSession())?.user_id;
        if (!currentUser) {
            throw new Error('No current user session found');
        }
        this.teams.push(team);
        this.addMember(team.id, currentUser, 'Team Leader');

        return TeamDto.fromEntity(team);
    }

    async requestToJoinTeam(teamId: number): Promise<void> {
          const currentUser = (await authRepository.getCurrentSession())?.user_id;
        if (!currentUser) {
            throw new Error('No current user session found');
        }
        this.addMember(teamId, currentUser, 'Member');
    }

    async getUserTeam(userId: string): Promise<TeamDto | null> {
        const membership = this.findMembership(userId);
        if (!membership) return null;

        const team = this.teams.find((t) => t.id === membership.team_id);
        return team ? TeamDto.fromEntity(team) : null;
    }

    async getTeamMembers(teamId: number): Promise<TeamMemberDto[]> {
        return this.teamMembers
            .filter((m) => m.team_id === teamId)
            .map((m) => TeamMemberDto.fromEntity(m));
    }

    async leaveTeam(userId: string, teamId: number): Promise<void> {
        const index = this.teamMembers.findIndex((m) => m.user_id === userId && m.team_id === teamId);
        if (index !== -1) {
            this.teamMembers.splice(index, 1);
        }
    }

    async kickMember(teamId: number, memberUserId: string): Promise<void> {
        const index = this.teamMembers.findIndex((m) => m.user_id === memberUserId && m.team_id === teamId);
        if (index !== -1) {
            this.teamMembers.splice(index, 1);
        }
    }

    async promoteToLeader(teamId: number, memberUserId: string): Promise<void> {
        const currentLeader = this.findLeader(teamId);
        if (currentLeader) {
            currentLeader.role = 'Member';
        }

        const member = this.teamMembers.find((m) => m.team_id === teamId && m.user_id === memberUserId);
        if (!member) {
            throw new Error('User is not a member of this team');
        }
        member.role = 'Team Leader';
    }

    async updateMemberRole(teamId: number, userId: string, newRole: string): Promise<void> {
        const member = this.teamMembers.find((m) => m.team_id === teamId && m.user_id === userId);
        if (!member) {
            throw new Error('User is not a member of this team');
        }
        member.role = newRole;
    }

    async uploadTeamDocument(teamId: number, documentUrl: File): Promise<void> {
        const team = this.teams.find((t) => t.id === teamId);
        if (!team) {
            throw new Error('Team not found');
        }
        team.introduction_link = URL.createObjectURL(documentUrl);
    }

    async getPendingInvitations(userId: string): Promise<InvitationDto[]> {
        return this.invitations
            .filter((i) => i.receiver_user_id === userId && i.invitation_type === 'invite')
            .map((i) => InvitationDto.fromEntity(i));
    }

    async sendInvitation(senderId: string, receiverUniId: string): Promise<void> {
        const autoJoin = receiverUniId.endsWith(AUTO_JOIN_SUFFIX);
        const actualUniId = autoJoin ? receiverUniId.slice(0, -AUTO_JOIN_SUFFIX.length) : receiverUniId;

        const receiver = this.findUserByUniId(actualUniId);
        if (!receiver) {
            throw new Error('User not found');
        }

        if (this.findMembership(receiver.id)) {
            throw new Error('User already belongs to a team');
        }

        if (autoJoin) {
            const senderMembership = this.findMembership(senderId);
            if (!senderMembership) {
                throw new Error('Sender does not belong to a team');
            }
            this.addMember(senderMembership.team_id, receiver.id, 'Member');
            return;
        }

        this.invitations.push({
            sender_user_id: senderId,
            receiver_user_id: receiver.id,
            created_at: new Date().toISOString(),
            invitation_type: 'invite',
        });
    }

    async acceptInvitation(senderUserId: string, receiverUserId: string): Promise<void> {
        const index = this.invitations.findIndex(
            (i) => i.sender_user_id === senderUserId && i.receiver_user_id === receiverUserId && i.invitation_type === 'invite'
        );
        if (index === -1) {
            throw new Error('Invitation not found');
        }

        const senderMembership = this.findMembership(senderUserId);
        if (!senderMembership) {
            throw new Error('Sender does not belong to a team');
        }

        this.invitations.splice(index, 1);
        this.addMember(senderMembership.team_id, receiverUserId, 'Member');
    }

    async declineInvitation(senderUserId: string, receiverUserId: string): Promise<void> {
        const index = this.invitations.findIndex(
            (i) => i.sender_user_id === senderUserId && i.receiver_user_id === receiverUserId && i.invitation_type === 'invite'
        );
        if (index !== -1) {
            this.invitations.splice(index, 1);
        }
    }

    async getPendingJoinRequests(teamId: number): Promise<InvitationDto[]> {
        const leader = this.findLeader(teamId);
        if (!leader) return [];

        return this.invitations
            .filter((i) => i.receiver_user_id === leader.user_id && i.invitation_type === 'join_request')
            .map((i) => InvitationDto.fromEntity(i));
    }

    async acceptJoinRequest(applicantUserId: string, teamId: number): Promise<void> {
        const leader = this.findLeader(teamId);
        if (!leader) {
            throw new Error('Team has no leader');
        }

        const index = this.invitations.findIndex(
            (i) => i.sender_user_id === applicantUserId && i.receiver_user_id === leader.user_id && i.invitation_type === 'join_request'
        );
        if (index === -1) {
            throw new Error('Join request not found');
        }

        this.invitations.splice(index, 1);
        this.addMember(teamId, applicantUserId, 'Member');
    }

    async declineJoinRequest(applicantUserId: string, teamId: number): Promise<void> {
        const leader = this.findLeader(teamId);
        if (!leader) return;

        const index = this.invitations.findIndex(
            (i) => i.sender_user_id === applicantUserId && i.receiver_user_id === leader.user_id && i.invitation_type === 'join_request'
        );
        if (index !== -1) {
            this.invitations.splice(index, 1);
        }
    }

    async getSupervisedTeams(supervisorId: string): Promise<TeamDto[]> {
        return this.teams
            .filter((t) => t.supervisor_id === supervisorId)
            .map((t) => TeamDto.fromEntity(t));
    }

    async getUnsupervisedTeams(): Promise<TeamDto[]> {
        return this.teams
            .filter((t) => t.supervisor_id === null)
            .map((t) => TeamDto.fromEntity(t));
    }

    async setTeamSupervisor(teamId: number, supervisorId: string): Promise<void> {
        const team = this.teams.find((t) => t.id === teamId);
        if (!team) {
            throw new Error('Team not found');
        }
        team.supervisor_id = supervisorId;
    }

    async stopSupervising(teamId: number): Promise<void> {
        const team = this.teams.find((t) => t.id === teamId);
        if (!team) {
            throw new Error('Team not found');
        }
        team.supervisor_id = null;
    }
}
