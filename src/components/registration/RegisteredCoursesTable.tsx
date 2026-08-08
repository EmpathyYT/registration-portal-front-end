

import React from 'react';

export interface EnrolledCourse {
    semesterCourseId: string | number;
    courseId: string;
    courseName: string;
    credits: number;
    lectureTime: string;
    dayOfWeek: string;
    instructor: string;
    location: string;
}

interface RegisteredCourseRowProps {
    course: EnrolledCourse;
    onDrop: (semesterCourseId: string | number) => void;
}

export const RegisteredCourseRow: React.FC<RegisteredCourseRowProps> = ({ course, onDrop }) => {
    return (
        <tr>
            <td>{course.courseId}</td>
            <td>{course.courseName}</td>
            <td>{course.credits}</td>
            <td>{course.dayOfWeek}</td>
            <td>{course.lectureTime}</td>
            <td>{course.instructor}</td>
            <td>{course.location}</td>
            <td>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDrop(course.semesterCourseId)}
                >
                    Drop
                </button>
            </td>
        </tr>
    );
};

interface RegisteredCoursesTableProps {
    courses: EnrolledCourse[];
    onDropCourse: (semesterCourseId: string | number) => void;
}

const RegisteredCoursesTable: React.FC<RegisteredCoursesTableProps> = ({ courses, onDropCourse }) => {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">المواد المسجلة حالياً</h5>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover text-center align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>رقم المادة</th>
                                <th>اسم المادة</th>
                                <th>الساعات</th>
                                <th>الأيام</th>
                                <th>الوقت</th>
                                <th>المدرس</th>
                                <th>القاعة</th>
                                <th>الإجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-muted py-3">
                                        لا توجد مواد مسجلة حالياً
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <RegisteredCourseRow
                                        key={course.semesterCourseId}
                                        course={course}
                                        onDrop={onDropCourse}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RegisteredCoursesTable;