import React from 'react';
import type { Course, CourseSection } from '../../types/registration';

interface CourseSectionsTableProps {
    course: Course;
    sections: CourseSection[];
    onAddSection: (semester_course_id: number) => void;
    onClose: () => void;
}

const CourseSectionsTable: React.FC<CourseSectionsTableProps> = ({ course, sections, onAddSection, onClose }) => {
    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1050 }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.5rem' }}>

                    <div className="modal-header border-0 pt-4 px-4 px-md-5 pb-2 d-flex justify-content-between align-items-start">
                        <div>
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 fw-bold mb-2">
                                Available Sections
                            </span>
                            <h3 className="fw-bolder text-dark mb-0">{course.name}</h3>
                            <p className="text-muted small fw-semibold mt-1 mb-0">Course ID: {course.course_id}</p>
                        </div>
                        <button
                            type="button"
                            className="btn-close bg-light rounded-circle p-2"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body p-4 p-md-5 pt-3">
                        <div className="list-group list-group-flush gap-3">
                            {sections.length === 0 ? (
                                <div className="text-center py-5 text-muted fw-bold bg-light rounded-4">
                                    No sections currently available for this course.
                                </div>
                            ) : (
                                sections.map((section) => (
                                    <div
                                        key={section.semester_course_id}
                                        className="list-group-item border-0 p-3 p-md-4 bg-light rounded-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between"
                                        style={{ transition: 'all 0.2s ease' }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
                                    >
                                        <div className="d-flex align-items-center mb-3 mb-md-0">
                                            <div>
                                                <h6 className="fw-bolder text-dark mb-1 d-flex align-items-center gap-2">
                                                    <svg width="16" height="16" fill="#198754" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg>
                                                    {section.instructor_name}
                                                </h6>
                                                <div className="text-muted small fw-semibold d-flex gap-3 mt-2">
                                                    <span className="badge bg-white text-secondary border px-2 py-1">Section: {section.semester_course_id}</span>
                                                    <span className="badge bg-white text-secondary border px-2 py-1">{course.credits} Credits</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">

                                            <div className="text-md-end">
                                                {/* CHANGED: Removed the "Days:" label span */}
                                                <div className="fw-bolder text-dark small mb-2">
                                                    {section.days_of_week}
                                                </div>
                                                <div className="text-muted small d-flex align-items-center justify-content-md-end gap-1">
                                                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>
                                                    {section.lecture_time_in_day}
                                                    <span className="mx-1 opacity-50 fw-bold">|</span>
                                                    {section.location}
                                                </div>
                                            </div>

                                            <button
                                                className="btn btn-success fw-bold rounded-3 px-4 py-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
                                                onClick={() => onAddSection(section.semester_course_id)}
                                                style={{ transition: 'all 0.2s ease', minWidth: '100px' }}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSectionsTable;