import React from 'react';
import RegisteredCourseRow, { type EnrolledCourse } from './RegisteredCourseRow';

interface RegisteredCoursesTableProps {
    courses: EnrolledCourse[];
    onDropCourse: (semesterCourseId: string | number) => void;
}

export const RegisteredCoursesTable: React.FC<RegisteredCoursesTableProps> = ({
    courses,
    onDropCourse,
}) => {
    return (
        <div className="mb-5">
            <h3 className="mb-3 text-center">المواد المسجلة (Registered Courses)</h3>

            {courses.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    لا توجد مواد مسجلة حالياً.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped text-center align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>رقم المادة</th>
                                <th>اسم المادة</th>
                                <th>عدد الساعات</th>
                                <th>الأيام</th>
                                <th>الوقت</th>
                                <th>المدرس</th>
                                <th>القاعة</th>
                                <th>الإجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <RegisteredCourseRow
                                    key={course.semesterCourseId}
                                    course={course}
                                    onDrop={onDropCourse}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RegisteredCoursesTable;