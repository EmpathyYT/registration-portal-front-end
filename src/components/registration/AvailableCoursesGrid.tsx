import React from 'react';

export interface CourseSummary {
    courseId: string;
    courseName: string;
    credits: number;
    department?: string;
}

interface AvailableCoursesGridProps {
    courses: CourseSummary[];
    onSelectCourse: (courseId: string) => void;
    selectedCourseId?: string;
}

export const AvailableCoursesGrid: React.FC<AvailableCoursesGridProps> = ({
    courses,
    onSelectCourse,
    selectedCourseId,
}) => {
    return (
        <div className="mb-5">
            <h3 className="mb-3 text-center">المواد المقترحة للتسجيل (Available Courses)</h3>

            {courses.length === 0 ? (
                <div className="alert alert-secondary text-center" role="alert">
                    لا توجد مواد مقترحة للبحث.
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {courses.map((course) => {
                        const isSelected = course.courseId === selectedCourseId;
                        return (
                            <div key={course.courseId} className="col">
                                <div
                                    className={`card h-100 shadow-sm text-center ${isSelected ? 'border-primary bg-light' : ''
                                        }`}
                                >
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <div>
                                            <span className="badge bg-secondary mb-2">{course.courseId}</span>
                                            <h5 className="card-title fw-bold">{course.courseName}</h5>
                                            <p className="card-text text-muted mb-3">
                                                عدد الساعات: <strong>{course.credits}</strong>
                                            </p>
                                        </div>

                                        <button
                                            className={`btn ${isSelected ? 'btn-primary' : 'btn-outline-primary'} btn-sm w-100`}
                                            onClick={() => onSelectCourse(course.courseId)}
                                        >
                                            {isSelected ? 'الشعب المعروضة حالياً' : 'عرض الشعب المتاحة'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AvailableCoursesGrid;