import type { Subject, CourseEntity } from '../entities/course_entity';

export class CourseDto {
    course_id: number;
    name: string;
    credits: number;
    subject: Subject;

    constructor(data: { course_id: number; name: string; credits: number; subject: Subject }) {
        this.course_id = data.course_id;
        this.name = data.name;
        this.credits = data.credits;
        this.subject = data.subject;
    }

    static fromEntity(entity: CourseEntity): CourseDto {
        return new CourseDto({
            course_id: entity.id,
            name: entity.name,
            credits: entity.credits,
            subject: entity.subject,
        });
    }

    toEntity(): CourseEntity {
        return {
            id: this.course_id,
            name: this.name,
            credits: this.credits,
            subject: this.subject,
        };
    }
}
