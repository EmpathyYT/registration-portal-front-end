import type { CoursesDataSource } from '../datasources/courses_data_source';
import { MockCoursesDataSource } from '../datasources/mock_courses_data_source';
import type { CourseDto } from '../dtos/course_dto';
import type { SemesterCourseDto } from '../dtos/semester_course_dto';
import type { EnrollmentDto } from '../dtos/enrollment_dto';

/**
 * Repository for courses, delegating to an injected CoursesDataSource.
 */
export class CoursesRepository {
    private readonly dataSource: CoursesDataSource;

    constructor(dataSource: CoursesDataSource) {
        this.dataSource = dataSource;
    }

    getAvailableCourses(): Promise<CourseDto[]> {
        return this.dataSource.getAvailableCourses();
    }

    getCourseSections(courseId: number): Promise<SemesterCourseDto[]> {
        return this.dataSource.getCourseSections(courseId);
    }

    getStudentSchedule(userId: string): Promise<EnrollmentDto[]> {
        return this.dataSource.getStudentSchedule(userId);
    }

    commitSchedule(userId: string, semesterCourseIds: number[]): Promise<void> {
        return this.dataSource.commitSchedule(userId, semesterCourseIds);
    }

    dropSection(userId: string, semesterCourseId: number): Promise<void> {
        return this.dataSource.dropSection(userId, semesterCourseId);
    }
}

export const coursesRepository = new CoursesRepository(new MockCoursesDataSource());
