export interface Team {
    team_id: number;
    Name: string;
    title: string;
    status: string;
    min_users: number;
    max_users: number;
    introduction_link: string;
    This_Sem_Project_Id: string;
    supervisor_id: string;
}

export interface User {
    user_id: string;
    full_name: string;
    university_id: string;
    role: 'student' | 'teacher';
}

export interface TeamMember extends User {
    team_id: number;
    team_role: string;
}

export interface Invitation {
    team_id: number;
    sender_user_id: string;
    receiver_user_id: string;
    created_at: string;
    team_name: string;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    invitation_type: 'INVITE' | 'JOIN_REQUEST';
}

export interface Reservation {
    team_id: number;
    location: string;
    reservation_time: string;
}