export interface Course {
    course_id: string;
    name: string;
    credits: number;
}

export interface CourseSection {
    semester_course_id: number;
    course_id: string;
    instructor_name: string;
    lecture_time_in_day: string;
    days_of_week: string;
    location: string;
}

export interface EnrolledCourse {
    semester_course_id: number;
    course_id: string;
    name: string;
    credits: number;
    instructor_name: string;
    lecture_time_in_day: string;
    days_of_week: string;
    location: string;
}