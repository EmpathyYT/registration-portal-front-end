export interface User {
    user_id: string;
    full_name: string;
    university_id: string;
    role: 'student' | 'supervisor';
}

export interface Team {
    team_id: number;
    project_title: string | null;
    status: 'pending' | 'approved' | 'rejected' | null;
    min_users: number;
    max_users: number;
    introduction_link: string | null;
    supervisor_id: string | null;
    supervisor_name?: string | null;
    member_count?: number;
}

export interface TeamMember {
    team_id: number;
    user_id: string;
    full_name: string;
    university_id: string;
    team_role: string | null;
}

export interface Invitation {
    sender_user_id: string;
    receiver_user_id: string;
    sender_full_name: string;
    sender_university_id: string;
    created_at: string;
    invitation_type?: string;
}

export interface Reservation {
    team_id: number;
    location: string;
    reservation_time: string;
}
