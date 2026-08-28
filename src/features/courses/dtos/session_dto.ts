import type { DayOfWeek, SessionEntity } from '../entities/session_entity';

export class SessionDto {
    session_id: number;
    semester_course_id: number;
    location: string;
    time: string;
    end_time: string;
    day_of_week: DayOfWeek;

    constructor(data: { session_id: number; semester_course_id: number; location: string; time: string; end_time: string; day_of_week: DayOfWeek }) {
        this.session_id = data.session_id;
        this.semester_course_id = data.semester_course_id;
        this.location = data.location;
        this.time = data.time;
        this.end_time = data.end_time;
        this.day_of_week = data.day_of_week;
    }

    static fromEntity(entity: SessionEntity): SessionDto {
        return new SessionDto({
            session_id: entity.session_id,
            semester_course_id: entity.semester_course_id,
            location: entity.location,
            time: entity.time,
            end_time: entity.end_time,
            day_of_week: entity.day_of_week,
        });
    }

    toEntity(): SessionEntity {
        return {
            session_id: this.session_id,
            semester_course_id: this.semester_course_id,
            location: this.location,
            time: this.time,
            end_time: this.end_time,
            day_of_week: this.day_of_week,
        };
    }
}
