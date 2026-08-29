import React, { useState } from 'react';
import type { Course, CourseSection } from '../../types/registration';
import { styles, modalOverlayStyle, modalContentStyle, addBtnStyle } from '../../styles/components/registration/CourseSectionsTableStyles';

interface CourseSectionsTableProps {
    course: Course;
    sections: CourseSection[];
    onAddSection: (semester_course_id: number) => void;
    onClose: () => void;
}

const CourseSectionsTable: React.FC<CourseSectionsTableProps> = ({ course, sections, onAddSection, onClose }) => {
    const [addingSectionId, setAddingSectionId] = useState<number | null>(null);

    const handleAddSection = (sectionId: number) => {
        setAddingSectionId(sectionId);
        setTimeout(() => {
            onAddSection(sectionId);
            setAddingSectionId(null);
        }, 320);
    };

    return (
        <div className={styles.overlay} style={modalOverlayStyle} tabIndex={-1}>
            <div className={styles.dialog}>
                <div className={styles.content} style={modalContentStyle}>
                    <div className={styles.header}>
                        <div>
                            <span className={styles.availableBadge}>Available Sections</span>
                            <h3 className={styles.courseTitle}>{course.name}</h3>
                            <p className={styles.courseId}>Course ID: {course.course_id}</p>
                        </div>
                        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close"></button>
                    </div>

                    <div className={styles.body}>
                        <div className={styles.list}>
                            {sections.length === 0 ? (
                                <div className={styles.emptyState}>No sections currently available for this course.</div>
                            ) : (
                                sections.map((section, index) => (
                                    <div
                                        key={section.semester_course_id}
                                        className={styles.row}
                                        style={{ animationDelay: `${index * 55}ms` }}
                                    >
                                        <div className={styles.rowLeft}>
                                            <div>
                                                <h6 className={styles.instructorName}>
                                                    <svg width="16" height="16" fill="#198754" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg>
                                                    {section.instructor_name}
                                                </h6>
                                                <div className={styles.metaRow}>
                                                    <span className={styles.metaBadge}>Section: {section.semester_course_id}</span>
                                                    <span className={styles.metaBadge}>{course.credits} Credits</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.rowRight}>
                                            <div className={styles.scheduleBlock}>
                                                <div className={styles.daysText}>{section.days_of_week}</div>
                                                <div className={styles.timeRow}>
                                                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>
                                                    {section.lecture_time_in_day}
                                                    <span className={styles.separator}>|</span>
                                                    {section.location}
                                                </div>
                                            </div>
                                            <button
                                                className={styles.addBtn}
                                                onClick={() => handleAddSection(section.semester_course_id)}
                                                style={addBtnStyle}
                                                disabled={addingSectionId === section.semester_course_id}
                                            >
                                                {addingSectionId === section.semester_course_id ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        Adding...
                                                    </>
                                                ) : 'Add'}
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