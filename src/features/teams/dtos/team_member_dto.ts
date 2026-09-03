import type { TeamMemberEntity } from '../entities/team_member_entity';

export class TeamMemberDto {
    team_id: number;
    user_id: string;
    role: string | null;
    full_name: string;
    university_id: string;

    constructor(data: { team_id: number; user_id: string; role: string | null; full_name: string; university_id: string }) {
        this.team_id = data.team_id;
        this.user_id = data.user_id;
        this.role = data.role;
        this.full_name = data.full_name;
        this.university_id = data.university_id;
    }

    static fromEntity(entity: TeamMemberEntity): TeamMemberDto {
        return new TeamMemberDto({
            team_id: entity.team_id,
            user_id: entity.user_id,
            role: entity.role,
            full_name: entity.full_name,
            university_id: entity.university_id,
        });
    }

    toEntity(): TeamMemberEntity {
        return {
            team_id: this.team_id,
            user_id: this.user_id,
            role: this.role,
            full_name: this.full_name,
            university_id: this.university_id,
        };
    }
}
