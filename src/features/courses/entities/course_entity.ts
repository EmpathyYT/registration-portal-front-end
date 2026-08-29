export type Subject = 'course' | 'lab' | 'training' | 'project';

export interface CourseEntity {
    id: number;
    name: string;
    credits: number;
    subject: Subject;
}
