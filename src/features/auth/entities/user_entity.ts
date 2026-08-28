export type Role = 'student' | 'teacher';

export interface UserEntity {
    id: string;
    full_name: string;
    university_id: string;
    role: Role;
}
