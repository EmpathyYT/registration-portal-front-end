import React from 'react';
import type {CourseSection, Course} from '../../types/registration';
import CourseSectionRow from './CourseSectionRow';

interface CourseSectionsTableProps {
    course: Course;
    sections: CourseSection[];
    onAddSection: (semester_course_id: number) => void;
    onClose: () => void;
}

const CourseSectionsTable: React.FC<CourseSectionsTableProps> = ({ course, sections, onAddSection, onClose }) => {
    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-lg">

                    <div className="modal-header border-0 pt-4 px-4 pb-2">
                        <h4 className="modal-title fw-bolder text-primary">Available Sections: {course.name}</h4>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>

                    <div className="modal-body p-4">
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
                                {sections.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-muted py-4">
                                            No sections available for this course.
                                        </td>
                                    </tr>
                                ) : (
                                    sections.map((sec) => (
                                        <CourseSectionRow
                                            key={sec.semester_course_id}
                                            course={course}
                                            section={sec}
                                            onAdd={onAddSection}
                                        />
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CourseSectionsTable;