import { TeamsDataSource } from './teams_data_source';
import type { TeamDto } from '../dtos/team_dto';
import type { TeamMemberDto } from '../dtos/team_member_dto';
import type { InvitationDto } from '../dtos/invitation_dto';

/**
 * Supabase-backed implementation of TeamsDataSource.
 * Not implemented yet.
 */
export class SupabaseTeamsDataSource extends TeamsDataSource {
    async getAvailableTeams(): Promise<TeamDto[]> {
        throw new Error('Not implemented');
    }

    async createTeam(_projectTitle: string, _userId: string): Promise<TeamDto> {
        throw new Error('Not implemented');
    }

    async requestToJoinTeam(_userId: string, _teamId: number): Promise<void> {
        throw new Error('Not implemented');
    }

    async getUserTeam(_userId: string): Promise<TeamDto | null> {
        throw new Error('Not implemented');
    }

    async getTeamMembers(_teamId: number): Promise<TeamMemberDto[]> {
        throw new Error('Not implemented');
    }

    async leaveTeam(_userId: string, _teamId: number): Promise<void> {
        throw new Error('Not implemented');
    }

    async kickMember(_teamId: number, _memberUserId: string): Promise<void> {
        throw new Error('Not implemented');
    }

    async promoteToLeader(_teamId: number, _memberUserId: string): Promise<void> {
        throw new Error('Not implemented');
    }

    async updateMemberRole(_teamId: number, _userId: string, _newRole: string): Promise<void> {
        throw new Error('Not implemented');
    }

    async uploadTeamDocument(_teamId: number, _documentUrl: string): Promise<void> {
        throw new Error('Not implemented');
    }

    async getPendingInvitations(_userId: string): Promise<InvitationDto[]> {
        throw new Error('Not implemented');
    }

    async sendInvitation(_senderId: string, _receiverUniId: string): Promise<void> {
        throw new Error('Not implemented');
    }

    async acceptInvitation(_senderUserId: string, _receiverUserId: string): Promise<void> {
        throw new Error('Not implemented');
    }

    async declineInvitation(_senderUserId: string, _receiverUserId: string): Promise<void> {
        throw new Error('Not implemented');
    }

    async getPendingJoinRequests(_teamId: number): Promise<InvitationDto[]> {
        throw new Error('Not implemented');
    }

    async acceptJoinRequest(_applicantUserId: string, _teamId: number): Promise<void> {
        throw new Error('Not implemented');
    }

    async declineJoinRequest(_applicantUserId: string, _teamId: number): Promise<void> {
        throw new Error('Not implemented');
    }

    async getSupervisedTeams(_supervisorId: string): Promise<TeamDto[]> {
        throw new Error('Not implemented');
    }

    async getUnsupervisedTeams(): Promise<TeamDto[]> {
        throw new Error('Not implemented');
    }

    async setTeamSupervisor(_teamId: number, _supervisorId: string): Promise<void> {
        throw new Error('Not implemented');
    }

    async stopSupervising(_teamId: number): Promise<void> {
        throw new Error('Not implemented');
    }
}
