// import React from 'react';

// // 1. تعريف واجهة بيانات الشعبة الدراسية
// export interface CourseSection {
//     semesterCourseId: string | number;
//     instructor: string;
//     dayOfWeek: string;
//     lectureTime: string;
//     location: string;
// }

// // 2. تعريف الـ Props للمكون
// interface CourseSectionRowProps {
//     section: CourseSection;
//     onAdd: (semesterCourseId: string | number) => void;
// }

// // 3. المكون
// export const CourseSectionRow: React.FC<CourseSectionRowProps> = ({ section, onAdd }) => {
//     return (
//         <tr>
//             {/* 6. المدرس */}
//             <td>{section.instructor}</td>
//             {/* 4. الأيام */}
//             <td>{section.dayOfWeek}</td>
//             {/* 5. الوقت */}
//             <td>{section.lectureTime}</td>
//             {/* 7. القاعة */}
//             <td>{section.location}</td>
//             {/* 8. الإجراء (زر Drop الأحمر) */}
//             <td>
//                 <button
//                     className="btn btn-success btn-sm"
//                     onClick={() => onAdd(section.semesterCourseId)}
//                 >
//                     Add
//                 </button>
//             </td>
//         </tr>
//     );
// };

// export default CourseSectionRow;

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