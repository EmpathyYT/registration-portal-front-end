import type { TeamDto } from '../dtos/team_dto';
import type { TeamMemberDto } from '../dtos/team_member_dto';
import type { InvitationDto } from '../dtos/invitation_dto';
import type { UserDto } from '../../auth/dtos/user_dto';

/**
 * Base contract for teams data sources.
 * Concrete data sources (mock, supabase, ...) must implement every method.
 */
export abstract class TeamsDataSource {
    /**
     * Gets every team that can currently be requested to join.
     * @returns The list of available teams.
     */
    abstract getAvailableTeams(): Promise<TeamDto[]>;

    /**
     * Creates a new team and makes the creator its leader.
     * @param projectTitle - The team's project title.
     * @returns The newly created team.
     */
    abstract createTeam(projectTitle: string): Promise<TeamDto>;

    /**
     * Requests to join a team.
     * @param teamId - The id of the team to join.
     */
    abstract requestToJoinTeam(teamId: number): Promise<void>;

    /**
     * Gets the team a user currently belongs to.
     * @param userId - The id of the user.
     * @returns The user's team, or null if they aren't on one.
     */
    abstract getUserTeam(userId: string): Promise<TeamDto | null>;

    /**
     * Gets the members of a team.
     * @param teamId - The id of the team.
     * @returns The list of team members.
     */
    abstract getTeamMembers(teamId: number): Promise<TeamMemberDto[]>;

    /**
     * Removes a user from a team.
     * @param userId - The id of the user leaving.
     * @param teamId - The id of the team.
     */
    abstract leaveTeam(userId: string, teamId: number): Promise<void>;

    /**
     * Removes a member from a team.
     * @param teamId - The id of the team.
     * @param memberUserId - The id of the member to remove.
     */
    abstract kickMember(teamId: number, memberUserId: string): Promise<void>;

    /**
     * Promotes a member to team leader.
     * @param teamId - The id of the team.
     * @param memberUserId - The id of the member to promote.
     */
    abstract promoteToLeader(teamId: number, memberUserId: string): Promise<void>;

    /**
     * Updates a member's role label within a team.
     * @param teamId - The id of the team.
     * @param userId - The id of the member.
     * @param newRole - The new role label.
     */
    abstract updateMemberRole(teamId: number, userId: string, newRole: string): Promise<void>;

    /**
     * Sets a team's document / introduction link.
     * @param teamId - The id of the team.
     * @param document - The file object of the document.
     */
    abstract uploadTeamDocument(teamId: number, document: File): Promise<void>;

    /**
     * Gets the invitations a user has been sent.
     * @param userId - The id of the invited user.
     * @returns The list of pending invitations.
     */
    abstract getPendingInvitations(userId: string): Promise<InvitationDto[]>;

    /**
     * Sends a team invitation to a user identified by their university id.
     * @param senderId - The id of the sending (inviting) user.
     * @param receiverUniId - The university id of the invited user.
     * @param teamId - The id of the team to invite the user to.
     */
    abstract sendInvitation(senderId: string, receiverUniId: string, teamId: number): Promise<void>;

    /**
     * Accepts an invitation, joining the sender's team.
     * @param senderUserId - The id of the user who sent the invitation.
     * @param receiverUserId - The id of the user accepting the invitation.
     */
    abstract acceptInvitation(senderUserId: string, receiverUserId: string): Promise<void>;

    /**
     * Declines an invitation.
     * @param senderUserId - The id of the user who sent the invitation.
     * @param receiverUserId - The id of the user declining the invitation.
     */
    abstract declineInvitation(senderUserId: string, receiverUserId: string): Promise<void>;

    /**
     * Gets the pending requests to join a team.
     * @param teamId - The id of the team.
     * @returns The list of pending join requests.
     */
    abstract getPendingJoinRequests(teamId: number): Promise<InvitationDto[]>;

    /**
     * Accepts a user's request to join a team.
     * @param applicantUserId - The id of the requesting user.
     * @param teamId - The id of the team.
     */
    abstract acceptJoinRequest(applicantUserId: string, teamId: number): Promise<void>;

    /**
     * Declines a user's request to join a team.
     * @param applicantUserId - The id of the requesting user.
     * @param teamId - The id of the team.
     */
    abstract declineJoinRequest(applicantUserId: string, teamId: number): Promise<void>;

    /**
     * Gets every team supervised by a given supervisor. Admin-only.
     * @param supervisorId - The id of the supervisor (a user with role "teacher").
     * @returns The list of teams that supervisor supervises.
     */
    abstract getSupervisedTeams(supervisorId: string): Promise<TeamDto[]>;

    /**
     * Gets every team that has no supervisor assigned. Admin-only.
     * @returns The list of unsupervised teams.
     */
    abstract getUnsupervisedTeams(): Promise<TeamDto[]>;

    /**
     * Assigns a supervisor to a team. Admin-only.
     * @param teamId - The id of the team.
     * @param supervisorId - The id of the supervisor to assign.
     */
    abstract setTeamSupervisor(teamId: number, supervisorId: string): Promise<void>;

    /**
     * Removes a team's supervisor. Admin-only.
     * @param teamId - The id of the team.
     */
    abstract stopSupervising(teamId: number): Promise<void>;

    /**
     * Gets every user with the role of "teacher" (supervisor).
     * @returns The list of supervisors.
     */
    abstract getSupervisors(): Promise<UserDto[]>;



    /**
     * Gets the number of members in a team.
     * @param teamId - The id of the team.
     * @returns The number of members in the team.
     */
    abstract getMemberCount(teamId: number): Promise<number>;
}
