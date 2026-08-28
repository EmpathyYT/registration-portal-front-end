export type DayOfWeek = 'Su' | 'Mo' | 'Tu' | 'We' | 'Th' | 'Sa';

export interface SessionEntity {
    session_id: number;
    semester_course_id: number;
    location: string;
    time: string;
    end_time: string;
    day_of_week: DayOfWeek;
}
