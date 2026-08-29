import { CoursesDataSource } from './courses_data_source';
import { CourseDto } from '../dtos/course_dto';
import { SemesterCourseDto } from '../dtos/semester_course_dto';
import { SessionDto } from '../dtos/session_dto';
import { EnrollmentDto } from '../dtos/enrollment_dto';
import type { CourseEntity } from '../entities/course_entity';
import type { SemesterCourseEntity } from '../entities/semester_course_entity';
import type { SessionEntity } from '../entities/session_entity';
import type { EnrollmentEntity } from '../entities/enrollment_entity';

const MOCK_COURSES: CourseEntity[] = [
    { id: 1, name: 'Intro to Programming', credits: 3, subject: 'course' },
    { id: 2, name: 'Data Structures', credits: 3, subject: 'course' },
    { id: 3, name: 'Databases Lab', credits: 1, subject: 'lab' },
];

const MOCK_SEMESTER_COURSES: SemesterCourseEntity[] = [
    { id: 1001, course_id: 1, instructor: 'instructor-1' },
    { id: 1002, course_id: 2, instructor: 'instructor-2' },
    { id: 1003, course_id: 3, instructor: 'instructor-3' },
];

const MOCK_SESSIONS: SessionEntity[] = [
    { session_id: 1, semester_course_id: 1001, location: 'B1', time: '10:00', end_time: '11:00', day_of_week: 'Su' },
    { session_id: 2, semester_course_id: 1001, location: 'B1', time: '10:00', end_time: '11:00', day_of_week: 'Tu' },
    { session_id: 3, semester_course_id: 1002, location: 'B2', time: '12:00', end_time: '13:00', day_of_week: 'Mo' },
    { session_id: 4, semester_course_id: 1002, location: 'B2', time: '12:00', end_time: '13:00', day_of_week: 'We' },
    { session_id: 5, semester_course_id: 1003, location: 'B3', time: '14:00', end_time: '15:00', day_of_week: 'Su' },
];

/**
 * In-memory mock implementation of CoursesDataSource.
 * Models the semester_courses/sessions/enrollments tables directly and
 * returns them as the DTOs the rest of the app works with.
 */
export class MockCoursesDataSource extends CoursesDataSource {
    private readonly enrollments: EnrollmentEntity[] = [];

    private toSemesterCourseDto(semesterCourse: SemesterCourseEntity): SemesterCourseDto {
        const sessions = MOCK_SESSIONS
            .filter((s) => s.semester_course_id === semesterCourse.id)
            .map((s) => SessionDto.fromEntity(s));

        return SemesterCourseDto.fromEntity(semesterCourse, sessions);
    }

    async getAvailableCourses(): Promise<CourseDto[]> {
        return MOCK_COURSES.map((course) => CourseDto.fromEntity(course));
    }

    async getCourseSections(courseId: number): Promise<SemesterCourseDto[]> {
        return MOCK_SEMESTER_COURSES
            .filter((sc) => sc.course_id === courseId)
            .map((sc) => this.toSemesterCourseDto(sc));
    }

    async getStudentSchedule(userId: string): Promise<EnrollmentDto[]> {
        return this.enrollments
            .filter((e) => e.user_id === userId)
            .map((e) => EnrollmentDto.fromEntity(e));
    }

    async commitSchedule(userId: string, semesterCourseIds: number[]): Promise<void> {
        for (let i = this.enrollments.length - 1; i >= 0; i--) {
            if (this.enrollments[i].user_id === userId) {
                this.enrollments.splice(i, 1);
            }
        }

        for (const semesterCourseId of semesterCourseIds) {
            this.enrollments.push({ user_id: userId, semester_course_id: semesterCourseId });
        }
    }

    async dropSection(userId: string, semesterCourseId: number): Promise<void> {
        const index = this.enrollments.findIndex(
            (e) => e.user_id === userId && e.semester_course_id === semesterCourseId
        );

        if (index !== -1) {
            this.enrollments.splice(index, 1);
        }
    }
}
