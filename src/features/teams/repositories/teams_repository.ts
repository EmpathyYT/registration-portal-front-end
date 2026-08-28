import type { TeamsDataSource } from '../datasources/teams_data_source';
import { MockTeamsDataSource } from '../datasources/mock_teams_data_source';
import type { TeamDto } from '../dtos/team_dto';
import type { TeamMemberDto } from '../dtos/team_member_dto';
import type { InvitationDto } from '../dtos/invitation_dto';

/**
 * Repository for teams, delegating to an injected TeamsDataSource.
 */
export class TeamsRepository {
    private readonly dataSource: TeamsDataSource;

    constructor(dataSource: TeamsDataSource) {
        this.dataSource = dataSource;
    }

    getAvailableTeams(): Promise<TeamDto[]> {
        return this.dataSource.getAvailableTeams();
    }

    createTeam(projectTitle: string, userId: string): Promise<TeamDto> {
        return this.dataSource.createTeam(projectTitle, userId);
    }

    requestToJoinTeam(userId: string, teamId: number): Promise<void> {
        return this.dataSource.requestToJoinTeam(userId, teamId);
    }

    getUserTeam(userId: string): Promise<TeamDto | null> {
        return this.dataSource.getUserTeam(userId);
    }

    getTeamMembers(teamId: number): Promise<TeamMemberDto[]> {
        return this.dataSource.getTeamMembers(teamId);
    }

    leaveTeam(userId: string, teamId: number): Promise<void> {
        return this.dataSource.leaveTeam(userId, teamId);
    }

    kickMember(teamId: number, memberUserId: string): Promise<void> {
        return this.dataSource.kickMember(teamId, memberUserId);
    }

    promoteToLeader(teamId: number, memberUserId: string): Promise<void> {
        return this.dataSource.promoteToLeader(teamId, memberUserId);
    }

    updateMemberRole(teamId: number, userId: string, newRole: string): Promise<void> {
        return this.dataSource.updateMemberRole(teamId, userId, newRole);
    }

    uploadTeamDocument(teamId: number, documentUrl: string): Promise<void> {
        return this.dataSource.uploadTeamDocument(teamId, documentUrl);
    }

    getPendingInvitations(userId: string): Promise<InvitationDto[]> {
        return this.dataSource.getPendingInvitations(userId);
    }

    sendInvitation(senderId: string, receiverUniId: string): Promise<void> {
        return this.dataSource.sendInvitation(senderId, receiverUniId);
    }

    acceptInvitation(senderUserId: string, receiverUserId: string): Promise<void> {
        return this.dataSource.acceptInvitation(senderUserId, receiverUserId);
    }

    declineInvitation(senderUserId: string, receiverUserId: string): Promise<void> {
        return this.dataSource.declineInvitation(senderUserId, receiverUserId);
    }

    getPendingJoinRequests(teamId: number): Promise<InvitationDto[]> {
        return this.dataSource.getPendingJoinRequests(teamId);
    }

    acceptJoinRequest(applicantUserId: string, teamId: number): Promise<void> {
        return this.dataSource.acceptJoinRequest(applicantUserId, teamId);
    }

    declineJoinRequest(applicantUserId: string, teamId: number): Promise<void> {
        return this.dataSource.declineJoinRequest(applicantUserId, teamId);
    }

    getSupervisedTeams(supervisorId: string): Promise<TeamDto[]> {
        return this.dataSource.getSupervisedTeams(supervisorId);
    }

    getUnsupervisedTeams(): Promise<TeamDto[]> {
        return this.dataSource.getUnsupervisedTeams();
    }

    setTeamSupervisor(teamId: number, supervisorId: string): Promise<void> {
        return this.dataSource.setTeamSupervisor(teamId, supervisorId);
    }

    stopSupervising(teamId: number): Promise<void> {
        return this.dataSource.stopSupervising(teamId);
    }
}

export const teamsRepository = new TeamsRepository(new MockTeamsDataSource());
