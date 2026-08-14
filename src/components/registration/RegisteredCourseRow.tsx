import React from 'react';
import type {EnrolledCourse} from '../../types/registration';

interface RegisteredCourseRowProps {
    course: EnrolledCourse;
    onDrop: (semester_course_id: number) => void;
}

export const RegisteredCourseRow: React.FC<RegisteredCourseRowProps> = ({ course, onDrop }) => {
    return (
        <tr>
            <td>
                <button
                    className="btn btn-outline-danger btn-sm fw-bold shadow-sm rounded-3 px-3"
                    onClick={() => onDrop(course.semester_course_id)}
                >
                    Drop
                </button>
            </td>
            <td className="text-secondary">{course.course_id}</td>
            <td className="fw-semibold">{course.name}</td>
            <td>{course.credits}</td>
            <td>{course.instructor_name}</td>
            <td>{course.days_of_week}</td>
            <td>{course.lecture_time_in_day}</td>
            <td>{course.location}</td>
        </tr>
    );
};

export default RegisteredCourseRow;