import { CoursesDataSource } from './courses_data_source';
import { CourseDto } from '../dtos/course_dto';
import { SemesterCourseDto } from '../dtos/semester_course_dto';
import { EnrollmentDto } from '../dtos/enrollment_dto';
import { supabase } from '../../../core/supabaseClient';
import { SessionDto } from '../dtos/session_dto';

/**
 * Supabase-backed implementation of CoursesDataSource.
 * Not implemented yet.
 */
export class SupabaseCoursesDataSource extends CoursesDataSource {
    async getAvailableCourses(): Promise<CourseDto[]> {
        const { data, error } = await supabase.from('courses').select('*');

        if (error) {
            throw new Error(`Failed to fetch available courses: ${error.message}`);
        }
        return data.map((course) => new CourseDto({
            course_id: course.id,
            name: course.name,
            credits: course.credits,
            subject: course.subject,
        }));
    }

    async getCourseSections(_courseId: number): Promise<SemesterCourseDto[]> {
        const { data, error } = await supabase.from('semester_courses').select('*').eq('course_id', _courseId);

        if (error) {
            throw new Error(`Failed to fetch course sections for course ID ${_courseId}: ${error.message}`);
        }

        const { data: sessionsData, error: sessionsError } = await supabase.from('sessions').select('*').in('semester_course_id', data.map(section => section.id));

        if (sessionsError) {
            throw new Error(`Failed to fetch sessions for course sections: ${sessionsError.message}`);
        }


        const sessionsMap = new Map<number, SessionDto[]>();
        sessionsData.forEach(session => {
            const sessionDto = new SessionDto({
                session_id: session.session_id,
                semester_course_id: session.semester_course_id,
                day_of_week: session.day_of_week,
                time: session.time,
                end_time: session.end_time,
                location: session.location,
            });

            if (!sessionsMap.has(session.semester_course_id)) {
                sessionsMap.set(session.semester_course_id, []);
            }
            sessionsMap.get(session.semester_course_id)?.push(sessionDto);
        });

        return data.map((section) => new SemesterCourseDto({
            semester_course_id: section.id,
            course_id: section.course_id,
            instructor_id: section.instructor,
            sessions: sessionsMap.get(section.id) || [],
        }));
    }
    
    async getStudentSchedule(_userId: string): Promise<EnrollmentDto[]> {
        const { data, error } = await supabase.from('enrollments').select('*').eq('user_id', _userId);

        if (error) {
            throw new Error(`Failed to fetch student schedule for user ID ${_userId}: ${error.message}`);
        }

        return data.map((enrollment) => new EnrollmentDto({
            user_id: enrollment.user_id,
            semester_course_id: enrollment.semester_course_id,
        }));
    }

    async commitSchedule(_userId: string, _semesterCourseIds: number[]): Promise<void> {
        const { error } = await supabase.from('enrollments').insert(
            _semesterCourseIds.map(semesterCourseId => ({
                user_id: _userId,
                semester_course_id: semesterCourseId,
            }))
        );

        if (error) {
            throw new Error(`Failed to commit schedule for user ID ${_userId}: ${error.message}`);
        }
    }

    async dropSection(_userId: string, _semesterCourseId: number): Promise<void> {
        const { error } = await supabase.from('enrollments').delete().eq('user_id', _userId).eq('semester_course_id', _semesterCourseId);

        if (error) {
            throw new Error(`Failed to drop section for user ID ${_userId}: ${error.message}`);
        }
    }
}
