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
                                                                              const [selectingCourseId, setSelectingCourseId] = useState<string | null>(null);

                                                                              const handleSelectCourse = (courseId: string) => {
                                                                                  setSelectingCourseId(courseId);
                                                                                  setTimeout(() => {
                                                                                      onSelectCourse(courseId);
                                                                                      setSelectingCourseId(null);
                                                                                  }, 260);
                                                                              };

    return (
        <div className="mb-5">
            {}
            <div className="text-center mb-4">
                <h4 className="fw-bolder mb-0" style={{ color: '#0f172a' }}>Available Courses</h4>
                <p className="text-muted small mb-0 mt-1">Select a course to view available sections</p>
            </div>

            {courses.length === 0 ? (
                <div className="alert bg-white border-0 shadow-sm rounded-4 p-5 text-center">
                    <h5 className="text-muted fw-bold">No courses available.</h5>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                    {courses.map((course, index) => {
                        const isSelected = course.course_id === selectedCourseId;
                        const isHovered = hoveredCard === course.course_id;
                        const isSelecting = selectingCourseId === course.course_id;

                        return (
                            <div key={course.course_id} className="col section-enter" style={{ animationDelay: `${index * 55}ms` }}>
                                {}
                                <div
                                    className={`card h-100 interactive-card ${isSelected ? 'border border-2 border-success' : 'border-0'}`}
                                    onMouseEnter={() => setHoveredCard(course.course_id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        borderRadius: '1rem',
                                        boxShadow: isHovered || isSelected ? '0 16px 48px rgba(15,23,42,0.13)' : '0 4px 20px rgba(15,23,42,0.07)',
                                        transform: isHovered && !isSelected ? 'translateY(-5px)' : 'none',
                                        transition: 'all 0.3s ease',
                                        background: 'rgba(255,255,255,0.88)',
                                        backdropFilter: 'blur(10px)',
                                        WebkitBackdropFilter: 'blur(10px)',
                                        border: isSelected ? '' : '1px solid rgba(255,255,255,0.6)'
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
                                            {}
                                            <button
                                                className={`btn w-100 fw-bold rounded-3 py-2 pressable-btn ${isSelected ? 'btn-success shadow-sm' : isHovered ? 'btn-outline-success' : 'btn-light text-success'}`}
                                                style={{ transition: 'all 0.2s ease' }}
                                                onClick={() => handleSelectCourse(course.course_id)}
                                                disabled={isSelecting}
                                            >
                                                {isSelecting ? 'Opening...' : isSelected ? 'Viewing Classes' : 'Show available classes'}
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