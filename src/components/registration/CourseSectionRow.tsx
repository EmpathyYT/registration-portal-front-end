import React from 'react';
import type {CourseSection, Course} from '../../types/registration';

interface CourseSectionRowProps {
    course: Course;
    section: CourseSection;
    onAdd: (semester_course_id: number) => void;
}

export const CourseSectionRow: React.FC<CourseSectionRowProps> = ({ course, section, onAdd }) => {
    return (
        <tr>
            <td>
                <button
                    className="btn btn-outline-success btn-sm fw-bold shadow-sm rounded-3 px-3"
                    onClick={() => onAdd(section.semester_course_id)}
                >
                    Add
                </button>
            </td>
            <td className="text-secondary">{course.course_id}</td>
            <td className="fw-semibold">{course.name}</td>
            <td>{course.credits}</td>
            <td>{section.instructor_name}</td>
            <td>{section.days_of_week}</td>
            <td>{section.lecture_time_in_day}</td>
            <td>{section.location}</td>
        </tr>
    );
};

export default CourseSectionRow;