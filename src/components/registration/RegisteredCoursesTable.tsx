import React, { useState } from 'react';
import type { EnrolledCourse } from '../../types/registration';
import {
    styles,
    cardStyle,
    cardHeaderStyle,
    iconBoxStyle,
    creditsBadgeTransition,
    commitBtnStyle,
    dropBtnStyle,
} from '../../styles/components/registration/RegisteredCoursesTableStyles';

export type CommitState = 'clean' | 'dirty' | 'committing' | 'success';

interface RegisteredCoursesTableProps {
    courses: EnrolledCourse[];
    onDropCourse: (semester_course_id: number) => void;
    onCommit: () => void;
    commitState: CommitState;
}

const RegisteredCoursesTable: React.FC<RegisteredCoursesTableProps> = ({ courses, onDropCourse, onCommit, commitState }) => {
    const [droppingCourseId, setDroppingCourseId] = useState<number | null>(null);
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const isOverCredits = totalCredits > 18;

    const handleDropCourse = (semesterCourseId: number) => {
        setDroppingCourseId(semesterCourseId);
        setTimeout(() => {
            onDropCourse(semesterCourseId);
            setDroppingCourseId(null);
        }, 260);
    };

    let btnClass = 'btn fw-bolder rounded-3 py-2 d-flex align-items-center justify-content-center gap-2 ';
    let btnContent = null;
    let isDisabled = false;

    if (isOverCredits) {
        btnClass += 'btn-danger border border-danger border-opacity-25';
        isDisabled = true;
        btnContent = (
            <>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                Limit Exceeded
            </>
        );
    } else if (commitState === 'clean') {
        btnClass += 'btn-light text-success border border-success border-opacity-25';
        isDisabled = true;
        btnContent = (
            <>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>
                Up to Date
            </>
        );
    } else if (commitState === 'dirty') {
        btnClass += 'btn-success btn-glowing';
        btnContent = (
            <>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="icon-spin-slow">
                    <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                </svg>
                Commit Changes
            </>
        );
    } else if (commitState === 'committing') {
        btnClass += 'btn-success';
        isDisabled = true;
        btnContent = (
            <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Saving...
            </>
        );
    } else if (commitState === 'success') {
        btnClass += 'btn-success text-white';
        isDisabled = true;
        btnContent = (
            <>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>
                Saved!
            </>
        );
    }

    return (
        <>
            <style>{`
                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.6); }
                    70% { box-shadow: 0 0 0 10px rgba(25, 135, 84, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0); }
                }
                .btn-glowing { animation: pulse-glow 2s infinite; }
                @keyframes spin-slow { 100% { transform: rotate(360deg); } }
                .icon-spin-slow { animation: spin-slow 3s linear infinite; }
            `}</style>

            <div className={styles.card} style={cardStyle}>
                <div className={styles.header} style={cardHeaderStyle}>
                    <div className={styles.headerLeft}>
                        <div style={iconBoxStyle}>
                            <svg width="18" height="18" fill="white" viewBox="0 0 16 16"><path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13zm1.5-.5a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-13zM5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm5-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm5-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>
                        </div>
                        <h3 className={styles.title} style={{ color: '#0f172a' }}>Registered Courses</h3>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.creditsBadge(isOverCredits)} style={creditsBadgeTransition}>
                            {isOverCredits ? `Limit Exceeded (${totalCredits})` : `Total Credits: ${totalCredits}`}
                        </div>
                        <button
                            className={`${btnClass} pressable-btn`}
                            onClick={onCommit}
                            disabled={isDisabled}
                            style={commitBtnStyle}
                        >
                            {btnContent}
                        </button>
                    </div>
                </div>

                <div className={styles.body}>
                    <div className={styles.list}>
                        {courses.length === 0 ? (
                            <div className={styles.emptyState}>No courses currently registered.</div>
                        ) : (
                            courses.map((course, index) => (
                                <div
                                    key={course.semester_course_id}
                                    className={styles.row}
                                    style={{ animationDelay: `${index * 45}ms` }}
                                >
                                    <div className={styles.rowLeft}>
                                        <div>
                                            <h6 className={styles.courseNameRow}>{course.name}</h6>
                                            <div className={styles.badgeRow}>
                                                <span className={styles.idBadge}>ID: {course.course_id}</span>
                                                <span className={styles.creditsBadgeSm}>{course.credits} Credits</span>
                                            </div>
                                            <div className={styles.instructorRow}>
                                                <svg width="14" height="14" fill="#198754" viewBox="0 0 16 16">
                                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                                </svg>
                                                {course.instructor_name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.rowRight}>
                                        <div className={styles.scheduleBlock}>
                                            <div className={styles.daysText}>{course.days_of_week}</div>
                                            <div className={styles.timeRow}>
                                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                                </svg>
                                                {course.lecture_time_in_day}
                                                <span className={styles.separator}>|</span>
                                                {course.location}
                                            </div>
                                        </div>
                                        <button
                                            className={styles.dropBtn}
                                            onClick={() => handleDropCourse(course.semester_course_id)}
                                            style={dropBtnStyle}
                                            disabled={droppingCourseId === course.semester_course_id}
                                        >
                                            {droppingCourseId === course.semester_course_id ? 'Dropping...' : 'Drop'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisteredCoursesTable;