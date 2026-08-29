export interface Course {
    course_id: string;
    name: string;
    credits: number;
}

export interface CourseSection {
    semester_course_id: number;
    instructor_name: string;
    days_of_week: string;
    lecture_time_in_day: string;
    location: string;
}

export interface EnrolledCourse {
    semester_course_id: number;
    course_id: string;
    name: string;
    credits: number;
    instructor_name: string;
    days_of_week: string;
    lecture_time_in_day: string;
    location: string;
}
