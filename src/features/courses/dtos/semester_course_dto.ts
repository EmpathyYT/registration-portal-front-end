import type { SemesterCourseEntity } from '../entities/semester_course_entity';
import { SessionDto } from './session_dto';

export class SemesterCourseDto {
    semester_course_id: number;
    course_id: number;
    instructor_id: string;
    sessions: SessionDto[];

    constructor(data: { semester_course_id: number; course_id: number; instructor_id: string; sessions?: SessionDto[] }) {
        this.semester_course_id = data.semester_course_id;
        this.course_id = data.course_id;
        this.instructor_id = data.instructor_id;
        this.sessions = data.sessions ?? [];
    }

    static fromEntity(entity: SemesterCourseEntity, sessions: SessionDto[] = []): SemesterCourseDto {
        return new SemesterCourseDto({
            semester_course_id: entity.id,
            course_id: entity.course_id,
            instructor_id: entity.instructor,
            sessions,
        });
    }

    toEntity(): SemesterCourseEntity {
        return {
            id: this.semester_course_id,
            course_id: this.course_id,
            instructor: this.instructor_id,
        };
    }
}
