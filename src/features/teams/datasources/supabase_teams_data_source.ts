import { TeamsDataSource } from './teams_data_source';
import { TeamDto } from '../dtos/team_dto';
import { TeamMemberDto } from '../dtos/team_member_dto';
import { InvitationDto } from '../dtos/invitation_dto';
import { supabase } from '../../../core/supabaseClient';
import { UserDto } from '../../auth/dtos/user_dto';

/**
 * Supabase-backed implementation of TeamsDataSource.
 */
export class SupabaseTeamsDataSource extends TeamsDataSource {
    async getMemberCount(teamId: number): Promise<number> {
        const { data, error } = await supabase.rpc('get_team_member_count', {
            p_team_id: teamId,
        });

        if (error) {
            throw new Error(`Failed to get member count: ${error.message}`);
        }

        return data;
    }

    async getSupervisors(): Promise<UserDto[]> {
        const { data, error } = await supabase
            .from('users')
            .select('id, full_name, university_id, role')
            .eq('role', 'teacher');

        if (error) {
            throw new Error(`Failed to fetch supervisors: ${error.message}`);
        }

        return data.map((user) => new UserDto(user));
    }

    async getAvailableTeams(): Promise<TeamDto[]> {
        const { data, error } = await supabase.from('teams').select('id, min_users, max_users, project_title, status, introduction_link, supervisor_id');
        if (error) {
            throw new Error(`Failed to fetch available teams: ${error.message}`);

        }

        const memberCount = await Promise.all(data.map((team) => {
            return this.getMemberCount(team.id);
        }));

        return data.map((team, index) => new TeamDto({ ...team, member_count: memberCount[index] }));
    }

    async createTeam(_projectTitle: string): Promise<TeamDto> {
        const { data, error } = await supabase
            .from('teams')
            .insert({
                project_title: _projectTitle,
                min_users: 1,
                max_users: 6,
            })
            .select('id, min_users, max_users, project_title, status, introduction_link, supervisor_id')
            .single();

        if (error) {
            throw new Error(`Failed to create team: ${error.message}`);
        }

        return new TeamDto({ ...data, member_count: 1 });
    }

    async requestToJoinTeam(_teamId: number): Promise<void> {
        const { error } = await supabase.rpc('request_to_join_team', {
            p_team_id: _teamId,
        });

        if (error) {
            throw new Error(`Failed to request to join team: ${error.message}`);
        }
    }

    async getUserTeam(_userId: string): Promise<TeamDto | null> {
        const { data, error } = await supabase
            .from('team_members')
            .select('team_id')
            .eq('user_id', _userId)
            .maybeSingle();

        if (error) {
            throw new Error(`Failed to fetch user's team: ${error.message}`);
        }

        if (!data) {
            return null;
        }

        const teamId = data.team_id;
        const memberCount = await this.getMemberCount(teamId);
        const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .select('id, min_users, max_users, project_title, status, introduction_link, supervisor_id')
            .eq('id', teamId)
            .single();

        if (teamError) {
            throw new Error(`Failed to fetch team details: ${teamError.message}`);
        }

        return new TeamDto({ ...teamData, member_count: memberCount });
    }

    async getTeamMembers(_teamId: number): Promise<TeamMemberDto[]> {
        const { data, error } = await supabase
            .from('team_members_with_names')
            .select('team_id, user_id, role:member_role, full_name, university_id')
            .eq('team_id', _teamId);

        if (error) {
            throw new Error(`Failed to fetch team members: ${error.message}`);
        }

        return data.map((member) => new TeamMemberDto(member));
    }

    async leaveTeam(_userId: string, _teamId: number): Promise<void> {
        const { error } = await supabase
            .from('team_members')
            .delete()
            .eq('user_id', _userId)
            .eq('team_id', _teamId);

        if (error) {
            throw new Error(`Failed to leave team: ${error.message}`);
        }
    }

    async kickMember(_teamId: number, _memberUserId: string): Promise<void> {
        const { error } = await supabase
            .from('team_members')
            .delete()
            .eq('team_id', _teamId)
            .eq('user_id', _memberUserId);

        if (error) {
            throw new Error(`Failed to kick member: ${error.message}`);
        }
    }

    async promoteToLeader(_teamId: number, _memberUserId: string): Promise<void> {
        const { error } = await supabase.rpc('transfer_team_leadership', {
            p_team_id: _teamId,
            p_new_leader_id: _memberUserId,
        });

        if (error) {
            throw new Error(`Failed to promote member to leader: ${error.message}`);
        }
    }

    async updateMemberRole(_teamId: number, _userId: string, _newRole: string): Promise<void> {
        const { error } = await supabase.rpc('update_member_role', {
            p_team_id: _teamId,
            p_user_id: _userId,
            p_new_role: _newRole,
        });

        if (error) {
            throw new Error(`Failed to update member role: ${error.message}`);
        }
    }

    async uploadTeamDocument(_teamId: number, _document: File): Promise<void> {
        // The storage RLS policy requires the path to be exactly: <teamId>/document.pdf
        const storagePath = `${_teamId}/document.pdf`;
        const { data, error } = await supabase.storage
            .from('team-documents')
            .upload(storagePath, _document, {
                upsert: true,
                contentType: 'application/pdf',
            });

        if (error) {
            throw new Error(`Failed to upload team document: ${error.message}`);
        }

        const { error: updateError } = await supabase
            .from('teams')
            .update({ introduction_link: data.path })
            .eq('id', _teamId);

        if (updateError) {
            throw new Error(`Failed to update team document link: ${updateError.message}`);
        }
    }

    async getPendingInvitations(_userId: string): Promise<InvitationDto[]> {
        const { data, error } = await supabase
            .from('invitations_with_names')
            .select('*')
            .eq('receiver_user_id', _userId);

        if (error) {
            throw new Error(`Failed to fetch pending invitations: ${error.message}`);
        }

        return data.map((invitation) => new InvitationDto(invitation));
    }

    async sendInvitation(_senderId: string, _receiverUniId: string, _teamId: number): Promise<void> {
        // get_user_id expects a bigint — pass a number, not a string
        const { data: receiverData, error: receiverFetchError } = await supabase.rpc('get_user_id', {
            p_user_university_id: Number(_receiverUniId),
        });

        const { data: isTeacher, error: roleFetchError } = await supabase
            .from('users')
            .select('role')
            .eq('id', _senderId)
            .single();

        if (roleFetchError) {
            throw new Error(`Failed to fetch sender role: ${roleFetchError.message}`);
        }

        if (isTeacher?.role === 'teacher') {
            const { error: sendInvitationError } = await supabase.rpc('send_invitation_as_leader', {
                p_receiver_user_id: receiverData,
                p_team_id: _teamId,
            });
            if (sendInvitationError) {
                throw new Error(`Failed to send invitation as leader: ${sendInvitationError.message}`);
            }
            return;
        }

        if (receiverFetchError) {
            throw new Error(`Failed to fetch receiver user ID: ${receiverFetchError.message}`);
        }
        if (!receiverData) {
            throw new Error('Failed to send invitation: Student with that ID not found.');
        }
        const { error: receiverError } = await supabase
            .from('invitations')
            .insert({
                sender_user_id: _senderId,
                receiver_user_id: receiverData,
                invitation_type: 'invite',
            });

        if (receiverError) {
            throw new Error(`Failed to send invitation: ${receiverError.message}`);
        }
    }

    async acceptInvitation(_senderUserId: string, _receiverUserId: string): Promise<void> {
        const { error } = await supabase.rpc('accept_invitation', {
            p_sender_user_id: _senderUserId,
        });

        if (error) {
            throw new Error(`Failed to accept invitation: ${error.message}`);
        }
    }

    async declineInvitation(_senderUserId: string, _receiverUserId: string): Promise<void> {
        const { error } = await supabase
            .from('invitations')
            .delete()
            .eq('sender_user_id', _senderUserId)
            .eq('receiver_user_id', _receiverUserId);

        if (error) {
            throw new Error(`Failed to decline invitation: ${error.message}`);
        }
    }

    async getPendingJoinRequests(_teamId: number): Promise<InvitationDto[]> {
        const { data: members, error: membersError } = await supabase
            .from('team_members')
            .select('user_id')
            .eq('team_id', _teamId);

        if (membersError) {
            throw new Error(`Failed to fetch team members: ${membersError.message}`);
        }

        const memberIds = members.map((member) => member.user_id);
        if (memberIds.length === 0) {
            return [];
        }

        const { data, error } = await supabase
            .from('invitations_with_names')
            .select('*')
            .in('sender_user_id', memberIds)
            .eq('invitation_type', 'join_request');

        if (error) {
            throw new Error(`Failed to fetch pending join requests: ${error.message}`);
        }

        return data.map((invitation) => new InvitationDto(invitation));
    }

    async acceptJoinRequest(_applicantUserId: string, _teamId: number): Promise<void> {
        const { error } = await supabase.rpc('accept_join_request', {
            p_team_id: _teamId,
            p_applicant_user_id: _applicantUserId,
        });

        if (error) {
            throw new Error(`Failed to accept join request: ${error.message}`);
        }
    }

    async declineJoinRequest(_applicantUserId: string, _teamId: number): Promise<void> {
        const { error } = await supabase.rpc('decline_join_request', {
            p_team_id: _teamId,
            p_applicant_user_id: _applicantUserId,
        });

        if (error) {
            throw new Error(`Failed to decline join request: ${error.message}`);
        }
    }

    async getSupervisedTeams(_supervisorId: string): Promise<TeamDto[]> {
        const { data, error } = await supabase
            .from('teams')
            .select('id, min_users, max_users, project_title, status, introduction_link, supervisor_id')
            .eq('supervisor_id', _supervisorId);

        if (error) {
            throw new Error(`Failed to fetch supervised teams: ${error.message}`);
        }

        const memberCounts = await Promise.all(data.map((team) => this.getMemberCount(team.id)));

        return data.map((team) => new TeamDto({ ...team, member_count: memberCounts[data.indexOf(team)] }));
    }

    async getUnsupervisedTeams(): Promise<TeamDto[]> {
        const { data, error } = await supabase
            .from('teams')
            .select('id, min_users, max_users, project_title, status, introduction_link, supervisor_id')
            .is('supervisor_id', null);

        if (error) {
            throw new Error(`Failed to fetch unsupervised teams: ${error.message}`);
        }


        const memberCounts = await Promise.all(data.map((team) => this.getMemberCount(team.id)));

        return data.map((team, index) => new TeamDto({ ...team, member_count: memberCounts[index] }));
    }

    async setTeamSupervisor(_teamId: number, _supervisorId: string): Promise<void> {
        const { data, error } = await supabase
            .from('teams')
            .update({ supervisor_id: _supervisorId })
            .eq('id', _teamId)
            .select();

        if (error) {
            throw new Error(`Failed to set team supervisor: ${error.message}`);
        }
        if (!data || data.length === 0) {
            throw new Error('Failed to set team supervisor: Permission denied or team not found.');
        }
    }

    async stopSupervising(_teamId: number): Promise<void> {
        const { data, error } = await supabase
            .from('teams')
            .update({ supervisor_id: null })
            .eq('id', _teamId)
            .select();

        if (error) {
            throw new Error(`Failed to stop supervising: ${error.message}`);
        }
        if (!data || data.length === 0) {
            throw new Error('Failed to stop supervising: Permission denied or team not found.');
        }
    }
}
