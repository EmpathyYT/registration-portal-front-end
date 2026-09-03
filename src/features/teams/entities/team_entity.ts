export type ProjectStatus = 'pending' | 'approved' | 'rejected';

export interface TeamEntity {
    id: number;
    min_users: number;
    max_users: number;
    project_title: string | null;
    status: ProjectStatus | null;
    introduction_link: string | null;
    supervisor_id: string | null;
    member_count: number;
}
