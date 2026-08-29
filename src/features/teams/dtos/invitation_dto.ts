import type { InvitationType, InvitationEntity } from '../entities/invitation_entity';

export class InvitationDto {
    sender_user_id: string;
    receiver_user_id: string;
    created_at: string;
    invitation_type: InvitationType;

    constructor(data: { sender_user_id: string; receiver_user_id: string; created_at: string; invitation_type: InvitationType }) {
        this.sender_user_id = data.sender_user_id;
        this.receiver_user_id = data.receiver_user_id;
        this.created_at = data.created_at;
        this.invitation_type = data.invitation_type;
    }

    static fromEntity(entity: InvitationEntity): InvitationDto {
        return new InvitationDto({
            sender_user_id: entity.sender_user_id,
            receiver_user_id: entity.receiver_user_id,
            created_at: entity.created_at,
            invitation_type: entity.invitation_type,
        });
    }

    toEntity(): InvitationEntity {
        return {
            sender_user_id: this.sender_user_id,
            receiver_user_id: this.receiver_user_id,
            created_at: this.created_at,
            invitation_type: this.invitation_type,
        };
    }
}
