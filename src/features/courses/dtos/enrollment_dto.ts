import type { EnrollmentEntity } from '../entities/enrollment_entity';

export class EnrollmentDto {
    user_id: string;
    semester_course_id: number;

    constructor(data: { user_id: string; semester_course_id: number }) {
        this.user_id = data.user_id;
        this.semester_course_id = data.semester_course_id;
    }

    static fromEntity(entity: EnrollmentEntity): EnrollmentDto {
        return new EnrollmentDto({
            user_id: entity.user_id,
            semester_course_id: entity.semester_course_id,
        });
    }

    toEntity(): EnrollmentEntity {
        return {
            user_id: this.user_id,
            semester_course_id: this.semester_course_id,
        };
    }
}
