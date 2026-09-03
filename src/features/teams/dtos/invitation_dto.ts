import type { InvitationType, InvitationEntity } from '../entities/invitation_entity';

export class InvitationDto {
    sender_user_id: string;
    receiver_user_id: string;
    sender_full_name: string;
    sender_university_id: string;
    receiver_full_name: string;
    receiver_university_id: string;
    created_at: string;
    invitation_type: InvitationType;

    constructor(data: {
        sender_user_id: string;
        receiver_user_id: string;
        sender_full_name: string;
        sender_university_id: string;
        receiver_full_name: string;
        receiver_university_id: string;
        created_at: string;
        invitation_type: InvitationType;
    }) {
        this.sender_user_id = data.sender_user_id;
        this.receiver_user_id = data.receiver_user_id;
        this.sender_full_name = data.sender_full_name;
        this.sender_university_id = data.sender_university_id;
        this.receiver_full_name = data.receiver_full_name;
        this.receiver_university_id = data.receiver_university_id;
        this.created_at = data.created_at;
        this.invitation_type = data.invitation_type;
    }

    static fromEntity(entity: InvitationEntity): InvitationDto {
        return new InvitationDto({
            sender_user_id: entity.sender_user_id,
            receiver_user_id: entity.receiver_user_id,
            sender_full_name: entity.sender_full_name,
            sender_university_id: entity.sender_university_id,
            receiver_full_name: entity.receiver_full_name,
            receiver_university_id: entity.receiver_university_id,
            created_at: entity.created_at,
            invitation_type: entity.invitation_type,
        });
    }

    toEntity(): InvitationEntity {
        return {
            sender_user_id: this.sender_user_id,
            receiver_user_id: this.receiver_user_id,
            sender_full_name: this.sender_full_name,
            sender_university_id: this.sender_university_id,
            receiver_full_name: this.receiver_full_name,
            receiver_university_id: this.receiver_university_id,
            created_at: this.created_at,
            invitation_type: this.invitation_type,
        };
    }
}
