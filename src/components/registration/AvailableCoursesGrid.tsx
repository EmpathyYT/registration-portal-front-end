import React from 'react';
import type {Course} from '../../types/registration';

interface AvailableCoursesGridProps {
    courses: Course[];
    onSelectCourse: (course_id: string) => void;
    selectedCourseId?: string;
}

export const AvailableCoursesGrid: React.FC<AvailableCoursesGridProps> = ({
                                                                              courses,
                                                                              onSelectCourse,
                                                                              selectedCourseId,
                                                                          }) => {
    return (
        <div className="mb-5">
            <h4 className="mb-4 fw-bolder text-primary text-center">Available Courses</h4>
            {courses.length === 0 ? (
                <div className="alert alert-secondary text-center rounded-4 border-0 shadow-sm" role="alert">
                    There are no available courses.
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {courses.map((course) => {
                        const isSelected = course.course_id === selectedCourseId;
                        return (
                            <div key={course.course_id} className="col">
                                <div className={`card h-100 shadow-sm text-center border-0 rounded-4 ${isSelected ? 'bg-light border border-2 border-primary' : ''}`}>
                                    <div className="card-body p-4 d-flex flex-column justify-content-between">
                                        <div>
                                            <span className="badge bg-secondary mb-3 rounded-pill px-3 py-2">{course.course_id}</span>
                                            <h5 className="card-title fw-bold text-dark">{course.name}</h5>
                                            <p className="card-text text-muted mb-4 small">
                                                Credit Hours: <strong>{course.credits}</strong>
                                            </p>
                                        </div>

                                        <button
                                            className={`btn ${isSelected ? 'btn-primary' : 'btn-outline-primary'} btn-sm w-100 fw-bold shadow-sm rounded-3 py-2`}
                                            onClick={() => onSelectCourse(course.course_id)}
                                        >
                                            {isSelected ? 'Currently showing classes' : 'Show available classes'}
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