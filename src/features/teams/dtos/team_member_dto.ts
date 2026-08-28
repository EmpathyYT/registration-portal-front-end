import type { TeamMemberEntity } from '../entities/team_member_entity';

export class TeamMemberDto {
    team_id: number;
    user_id: string;
    role: string | null;

    constructor(data: { team_id: number; user_id: string; role: string | null }) {
        this.team_id = data.team_id;
        this.user_id = data.user_id;
        this.role = data.role;
    }

    static fromEntity(entity: TeamMemberEntity): TeamMemberDto {
        return new TeamMemberDto({
            team_id: entity.team_id,
            user_id: entity.user_id,
            role: entity.role,
        });
    }

    toEntity(): TeamMemberEntity {
        return {
            team_id: this.team_id,
            user_id: this.user_id,
            role: this.role,
        };
    }
}
