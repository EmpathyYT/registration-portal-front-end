export type InvitationType = 'invite' | 'join_request';

export interface InvitationEntity {
    sender_user_id: string;
    receiver_user_id: string;
    created_at: string;
    invitation_type: InvitationType;
}
