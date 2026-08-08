

import React from 'react';

export interface CourseSection {
    semesterCourseId: string | number;
    courseName?: string;
    instructor: string;
    dayOfWeek: string;
    lectureTime: string;
    location: string;
}

interface CourseSectionRowProps {
    section: CourseSection;
    onAdd: (semesterCourseId: string | number) => void;
}

export const CourseSectionRow: React.FC<CourseSectionRowProps> = ({ section, onAdd }) => {
    return (
        <tr>
            {section.courseName && <td>{section.courseName}</td>}
            <td>{section.instructor}</td>
            <td>{section.dayOfWeek}</td>
            <td>{section.lectureTime}</td>
            <td>{section.location}</td>
            <td>
                <button
                    className="btn btn-success btn-sm px-3"
                    onClick={() => onAdd(section.semesterCourseId)}
                >
                    Add
                </button>
            </td>
        </tr>
    );
};

export default CourseSectionRow;