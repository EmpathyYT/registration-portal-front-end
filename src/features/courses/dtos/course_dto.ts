import type { Subject, CourseEntity } from '../entities/course_entity';

export class CourseDto {
    id: number;
    name: string;
    credits: number;
    subject: Subject;

    constructor(data: { id: number; name: string; credits: number; subject: Subject }) {
        this.id = data.id;
        this.name = data.name;
        this.credits = data.credits;
        this.subject = data.subject;
    }

    static fromEntity(entity: CourseEntity): CourseDto {
        return new CourseDto({
            id: entity.id,
            name: entity.name,
            credits: entity.credits,
            subject: entity.subject,
        });
    }

    toEntity(): CourseEntity {
        return {
            id: this.id,
            name: this.name,
            credits: this.credits,
            subject: this.subject,
        };
    }
}
