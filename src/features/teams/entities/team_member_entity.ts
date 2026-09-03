export interface TeamMemberEntity {
    team_id: number;
    user_id: string;
    role: string | null;
    full_name: string;
    university_id: string;
}
