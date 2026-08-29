export interface Team {
    team_id: number;          // maps to teams.id
    project_title: string;    // teams.project_title
    status: string;           // teams.status (project_status enum)
    min_users: number;
    max_users: number;
    introduction_link: string;
    supervisor_id: string;
    // Joined from users WHERE id = supervisor_id:
    supervisor_name?: string;
}

export interface User {
    user_id: string;          // maps to users.id (uuid)
    full_name: string;
    university_id: string;
    role: 'student' | 'teacher' | 'supervisor';
}

export interface TeamMember extends User {
    team_id: number;
    team_role: string;        // maps to team_members.role (aliased in Supabase query)
}

export interface Invitation {
    sender_user_id: string;
    receiver_user_id: string;
    created_at: string;
    // Joined from users WHERE id = sender_user_id:
    sender_full_name: string;
    sender_university_id: string;
}

export interface Reservation {
    team_id: number;
    location: string;
    reservation_time: string;
}