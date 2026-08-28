import React from 'react';
import type { CourseSection, Course } from '../../types/registration';
import { styles } from '../../styles/components/registration/CourseSectionRowStyles';

interface CourseSectionRowProps {
    course: Course;
    section: CourseSection;
    onAdd: (semester_course_id: number) => void;
}

export const CourseSectionRow: React.FC<CourseSectionRowProps> = ({ course, section, onAdd }) => {
    return (
        <tr>
            <td>
                <button className={styles.addBtn} onClick={() => onAdd(section.semester_course_id)}>
                    Add
                </button>
            </td>
            <td className={styles.courseId}>{course.course_id}</td>
            <td className={styles.courseName}>{course.name}</td>
            <td>{course.credits}</td>
            <td>{section.instructor_name}</td>
            <td>{section.days_of_week}</td>
            <td>{section.lecture_time_in_day}</td>
            <td>{section.location}</td>
        </tr>
    );
};

export default CourseSectionRow;