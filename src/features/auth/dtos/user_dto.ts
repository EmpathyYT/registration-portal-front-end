import type { Role, UserEntity } from '../entities/user_entity';

export class UserDto {
    user_id: string;
    full_name: string;
    university_id: string;
    role: Role;

    constructor(data: { user_id: string; full_name: string; university_id: string; role: Role }) {
        this.user_id = data.user_id;
        this.full_name = data.full_name;
        this.university_id = data.university_id;
        this.role = data.role;
    }

    static fromEntity(entity: UserEntity): UserDto {
        return new UserDto({
            user_id: entity.id,
            full_name: entity.full_name,
            university_id: entity.university_id,
            role: entity.role,
        });
    }

    toEntity(): UserEntity {
        return {
            id: this.user_id,
            full_name: this.full_name,
            university_id: this.university_id,
            role: this.role,
        };
    }
}
