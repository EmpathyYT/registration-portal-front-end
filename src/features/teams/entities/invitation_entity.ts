export type InvitationType = 'invite' | 'join_request';

export interface InvitationEntity {
    sender_user_id: string;
    receiver_user_id: string;
    sender_full_name: string;
    sender_university_id: string;
    receiver_full_name: string;
    receiver_university_id: string;
    created_at: string;
    invitation_type: InvitationType;
}
