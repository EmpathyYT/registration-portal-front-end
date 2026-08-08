// import React from 'react';
// import CourseSectionRow, { type CourseSection } from './CourseSectionRow';

// interface CourseSectionsTableProps {
//     sections: CourseSection[];
//     onAddSection: (semesterCourseId: string | number) => void;
// }

// export const CourseSectionsTable: React.FC<CourseSectionsTableProps> = ({
//     sections,
//     onAddSection,
// }) => {
//     return (
//         <div className="mb-5">
//             <h3 className="mb-3 text-center">الشعب المتاحة (Available Sections)</h3>

//             {sections.length === 0 ? (
//                 <div className="alert alert-warning text-center" role="alert">
//                     لا توجد شعب متاحة لهذه المادة حالياً.
//                 </div>
//             ) : (
//                 <div className="table-responsive">
//                     <table className="table table-bordered table-striped text-center align-middle">
//                         <thead className="table-dark">
//                             <tr>
//                                 <th>المدرس</th>
//                                 <th>الأيام</th>
//                                 <th>الوقت</th>
//                                 <th>القاعة</th>
//                                 <th>الإجراء</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {sections.map((section) => (
//                                 <CourseSectionRow
//                                     key={section.semesterCourseId}
//                                     section={section}
//                                     onAdd={onAddSection}
//                                 />
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CourseSectionsTable;

import React from 'react';
import CourseSectionRow, { type CourseSection } from './CourseSectionRow';

interface CourseSectionsTableProps {
    sections: CourseSection[];
    onAddSection: (semesterCourseId: string | number) => void;
}

export const CourseSectionsTable: React.FC<CourseSectionsTableProps> = ({
    sections,
    onAddSection,
}) => {
    return (
        <div className="mb-5">
            <h3 className="mb-3 text-center">الشعب المتاحة (Available Sections)</h3>

            {sections.length === 0 ? (
                <div className="alert alert-warning text-center" role="alert">
                    لا توجد شعب متاحة لهذه المادة حالياً.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped text-center align-middle">
                        <thead className="table-dark">
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
                            {sections.map((section) => (
                                <CourseSectionRow
                                    key={section.semesterCourseId}
                                    section={section}
                                    onAdd={onAddSection}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CourseSectionsTable;