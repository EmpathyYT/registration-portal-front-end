import type { ProjectStatus, TeamEntity } from '../entities/team_entity';

export class TeamDto {
    id: number;
    member_count: number;
    min_users: number;
    max_users: number;
    project_title: string | null;
    status: ProjectStatus | null;
    introduction_link: string | null;
    supervisor_id: string | null;

    constructor(data: {
        id: number;
        min_users: number;
        max_users: number;
        project_title: string | null;
        status: ProjectStatus | null;
        introduction_link: string | null;
        member_count: number;
        supervisor_id: string | null;
    }) {
        this.id = data.id;
        this.min_users = data.min_users;
        this.max_users = data.max_users;
        this.project_title = data.project_title;
        this.status = data.status;
        this.introduction_link = data.introduction_link;
        this.member_count = data.member_count;
        this.supervisor_id = data.supervisor_id;
    }

    static fromEntity(entity: TeamEntity): TeamDto {
        return new TeamDto({
            id: entity.id,
            min_users: entity.min_users,
            max_users: entity.max_users,
            project_title: entity.project_title,
            status: entity.status,
            introduction_link: entity.introduction_link,
            supervisor_id: entity.supervisor_id,
            member_count: entity.member_count,
        });
    }

    toEntity(): TeamEntity {
        return {
            id: this.id,
            min_users: this.min_users,
            max_users: this.max_users,
            project_title: this.project_title,
            status: this.status,
            introduction_link: this.introduction_link,
            supervisor_id: this.supervisor_id,
            member_count : this.member_count,
        };
    }
}
