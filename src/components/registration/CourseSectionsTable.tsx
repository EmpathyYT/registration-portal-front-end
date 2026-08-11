
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

interface CourseSectionsTableProps {
    sections: CourseSection[];
    onAddSection: (semesterCourseId: string | number) => void;
}

const CourseSectionsTable: React.FC<CourseSectionsTableProps> = ({ sections, onAddSection }) => {
    return (
        <div className="table-responsive">
            <table className="table table-bordered table-hover text-center align-middle">
                <thead className="table-light">
                    <tr>
                        <th>اسم المادة</th>
                        <th>المدرس</th>
                        <th>الأيام</th>
                        <th>الوقت</th>
                        <th>القاعة</th>
                        <th>الإجراء</th>
                    </tr>
                </thead>
                <tbody>
                    {sections.map((sec) => (
                        <CourseSectionRow key={sec.semesterCourseId} section={sec} onAdd={onAddSection} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseSectionsTable;