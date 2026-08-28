import React from 'react';
import type { EnrolledCourse } from '../../types/registration';
import { styles } from '../../styles/components/registration/RegisteredCourseRowStyles';

interface RegisteredCourseRowProps {
    course: EnrolledCourse;
    onDrop: (semester_course_id: number) => void;
}

export const RegisteredCourseRow: React.FC<RegisteredCourseRowProps> = ({ course, onDrop }) => {
    return (
        <tr>
            <td>
                <button className={styles.dropBtn} onClick={() => onDrop(course.semester_course_id)}>
                    Drop
                </button>
            </td>
            <td className={styles.courseId}>{course.course_id}</td>
            <td className={styles.courseName}>{course.name}</td>
            <td>{course.credits}</td>
            <td>{course.instructor_name}</td>
            <td>{course.days_of_week}</td>
            <td>{course.lecture_time_in_day}</td>
            <td>{course.location}</td>
        </tr>
    );
};

export default RegisteredCourseRow;