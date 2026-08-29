import type { CourseDto } from '../dtos/course_dto';
import type { SemesterCourseDto } from '../dtos/semester_course_dto';
import type { EnrollmentDto } from '../dtos/enrollment_dto';

/**
 * Base contract for courses data sources.
 * Concrete data sources (mock, supabase, ...) must implement every method.
 */
export abstract class CoursesDataSource {
    /**
     * Gets every course that can be added to a schedule.
     * @returns The list of available courses.
     */
    abstract getAvailableCourses(): Promise<CourseDto[]>;

    /**
     * Gets the sections (semester courses, with their sessions) offered this semester for a given course.
     * @param courseId - The id of the course.
     * @returns The list of sections for that course.
     */
    abstract getCourseSections(courseId: number): Promise<SemesterCourseDto[]>;

    /**
     * Gets a student's current schedule.
     * @param userId - The id of the student.
     * @returns The list of enrollment rows for that student.
     */
    abstract getStudentSchedule(userId: string): Promise<EnrollmentDto[]>;

    /**
     * Commits a set of sections as a student's schedule.
     * @param userId - The id of the student.
     * @param semesterCourseIds - The ids of the sections to enroll in.
     */
    abstract commitSchedule(userId: string, semesterCourseIds: number[]): Promise<void>;

    /**
     * Drops a single section from a student's schedule.
     * @param userId - The id of the student.
     * @param semesterCourseId - The id of the section to drop.
     */
    abstract dropSection(userId: string, semesterCourseId: number): Promise<void>;
}
