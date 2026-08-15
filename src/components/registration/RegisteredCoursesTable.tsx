import React from 'react';
import type {EnrolledCourse} from '../../types/registration';
import RegisteredCourseRow from './RegisteredCourseRow';

interface RegisteredCoursesTableProps {
    courses: EnrolledCourse[];
    onDropCourse: (semester_course_id: number) => void;
}

const RegisteredCoursesTable: React.FC<RegisteredCoursesTableProps> = ({ courses, onDropCourse }) => {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

    return (
        <div className="card shadow-lg border-0 rounded-4 mb-4">
            <div className="card-header bg-transparent border-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
                <h4 className="mb-0 fw-bolder text-primary">Registered Courses</h4>
                <span className="badge bg-primary fs-6 p-2 shadow-sm rounded-pill">
                    Total Credits: {totalCredits} Hours
                </span>
            </div>
            <div className="card-body p-4">
                <div className="table-responsive rounded-3 border-0">
                    <table className="table table-hover text-center align-middle mb-0">
                        <thead className="table-light">
                        <tr>
                            <th className="fw-semibold text-secondary py-3">Action</th>
                            <th className="fw-semibold text-secondary py-3">Course ID</th>
                            <th className="fw-semibold text-secondary py-3">Course Name</th>
                            <th className="fw-semibold text-secondary py-3">Credits</th>
                            <th className="fw-semibold text-secondary py-3">Instructor</th>
                            <th className="fw-semibold text-secondary py-3">Days</th>
                            <th className="fw-semibold text-secondary py-3">Time</th>
                            <th className="fw-semibold text-secondary py-3">Location</th>
                        </tr>
                        </thead>
                        <tbody>
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-muted py-4">
                                    No courses currently registered
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => (
                                <RegisteredCourseRow
                                    key={course.semester_course_id}
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