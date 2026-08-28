import { CoursesDataSource } from './courses_data_source';
import type { CourseDto } from '../dtos/course_dto';
import type { SemesterCourseDto } from '../dtos/semester_course_dto';
import type { EnrollmentDto } from '../dtos/enrollment_dto';

/**
 * Supabase-backed implementation of CoursesDataSource.
 * Not implemented yet.
 */
export class SupabaseCoursesDataSource extends CoursesDataSource {
    async getAvailableCourses(): Promise<CourseDto[]> {
        throw new Error('Not implemented');
    }

    async getCourseSections(_courseId: number): Promise<SemesterCourseDto[]> {
        throw new Error('Not implemented');
    }

    async getStudentSchedule(_userId: string): Promise<EnrollmentDto[]> {
        throw new Error('Not implemented');
    }

    async commitSchedule(_userId: string, _semesterCourseIds: number[]): Promise<void> {
        throw new Error('Not implemented');
    }

    async dropSection(_userId: string, _semesterCourseId: number): Promise<void> {
        throw new Error('Not implemented');
    }
}
