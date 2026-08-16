import React, { useState } from 'react';
import type { Course } from '../../types/registration';

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
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    return (
        <div className="mb-5">
            {/* CHANGED: text-primary to text-success */}
            <h4 className="fw-bolder text-success text-center mb-4">Available Courses</h4>

            {courses.length === 0 ? (
                <div className="alert bg-white border-0 shadow-sm rounded-4 p-5 text-center">
                    <h5 className="text-muted fw-bold">No courses available.</h5>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                    {courses.map((course) => {
                        const isSelected = course.course_id === selectedCourseId;
                        const isHovered = hoveredCard === course.course_id;

                        return (
                            <div key={course.course_id} className="col">
                                {/* CHANGED: border-primary to border-success */}
                                <div
                                    className={`card h-100 bg-white ${isSelected ? 'border border-2 border-success' : 'border-0'}`}
                                    onMouseEnter={() => setHoveredCard(course.course_id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        borderRadius: '1rem',
                                        boxShadow: isHovered || isSelected ? '0 1rem 3rem rgba(0,0,0,0.1)' : '0 0.5rem 1.5rem rgba(0,0,0,0.05)',
                                        transform: isHovered && !isSelected ? 'translateY(-5px)' : 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div className="card-body p-4 d-flex flex-column text-center">
                                        <div className="mb-3">
                                            <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-2 fw-bold">
                                                {course.course_id}
                                            </span>
                                        </div>

                                        <h5 className="card-title fw-bolder text-dark mb-2">{course.name}</h5>
                                        <p className="card-text text-muted small fw-semibold mb-4">
                                            Credit Hours: <strong>{course.credits}</strong>
                                        </p>

                                        <div className="mt-auto">
                                            {/* CHANGED: btn-primary/text-primary to btn-success/text-success variants */}
                                            <button
                                                className={`btn w-100 fw-bold rounded-3 py-2 ${isSelected ? 'btn-success shadow-sm' : isHovered ? 'btn-outline-success' : 'btn-light text-success'}`}
                                                style={{ transition: 'all 0.2s ease' }}
                                                onClick={() => onSelectCourse(course.course_id)}
                                            >
                                                {isSelected ? 'Viewing Classes' : 'Show available classes'}
                                            </button>
                                        </div>
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