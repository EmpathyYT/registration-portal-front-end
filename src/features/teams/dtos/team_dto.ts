import type { ProjectStatus, TeamEntity } from '../entities/team_entity';

export class TeamDto {
    team_id: number;
    min_users: number;
    max_users: number;
    project_title: string | null;
    status: ProjectStatus | null;
    introduction_link: string | null;
    supervisor_id: string | null;

    constructor(data: {
        team_id: number;
        min_users: number;
        max_users: number;
        project_title: string | null;
        status: ProjectStatus | null;
        introduction_link: string | null;
        supervisor_id: string | null;
    }) {
        this.team_id = data.team_id;
        this.min_users = data.min_users;
        this.max_users = data.max_users;
        this.project_title = data.project_title;
        this.status = data.status;
        this.introduction_link = data.introduction_link;
        this.supervisor_id = data.supervisor_id;
    }

    static fromEntity(entity: TeamEntity): TeamDto {
        return new TeamDto({
            team_id: entity.id,
            min_users: entity.min_users,
            max_users: entity.max_users,
            project_title: entity.project_title,
            status: entity.status,
            introduction_link: entity.introduction_link,
            supervisor_id: entity.supervisor_id,
        });
    }

    toEntity(): TeamEntity {
        return {
            id: this.team_id,
            min_users: this.min_users,
            max_users: this.max_users,
            project_title: this.project_title,
            status: this.status,
            introduction_link: this.introduction_link,
            supervisor_id: this.supervisor_id,
        };
    }
}
