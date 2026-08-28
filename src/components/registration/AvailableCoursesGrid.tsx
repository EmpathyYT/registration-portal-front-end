import React, { useState } from 'react';
import type { Course } from '../../types/registration';
import { styles, cardHoverStyle, btnTransitionStyle } from '../../styles/components/registration/AvailableCoursesGridStyles';

interface AvailableCoursesGridProps {
    courses: Course[];
    onSelectCourse: (course_id: string) => void;
    selectedCourseId?: string;
}

export const AvailableCoursesGrid: React.FC<AvailableCoursesGridProps> = ({
    courses, onSelectCourse, selectedCourseId,
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
        <div className={styles.wrapper}>
            <div className={styles.heading}>
                <h4 className={styles.headingTitle} style={{ color: '#0f172a' }}>Available Courses</h4>
                <p className={styles.headingSubtitle}>Select a course to view available sections</p>
            </div>

            {courses.length === 0 ? (
                <div className={styles.emptyAlert}>
                    <h5 className={styles.emptyText}>No courses available.</h5>
                </div>
            ) : (
                <div className={styles.grid}>
                    {courses.map((course, index) => {
                        const isSelected = course.course_id === selectedCourseId;
                        const isHovered = hoveredCard === course.course_id;
                        const isSelecting = selectingCourseId === course.course_id;

                        return (
                            <div key={course.course_id} className={styles.col} style={{ animationDelay: `${index * 55}ms` }}>
                                <div
                                    className={styles.card(isSelected)}
                                    onMouseEnter={() => setHoveredCard(course.course_id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={cardHoverStyle(isHovered, isSelected)}
                                >
                                    <div className={styles.cardBody}>
                                        <div className={styles.badgeWrap}>
                                            <span className={styles.idBadge}>{course.course_id}</span>
                                        </div>
                                        <h5 className={styles.courseName}>{course.name}</h5>
                                        <p className={styles.credits}>
                                            Credit Hours: <strong>{course.credits}</strong>
                                        </p>
                                        <div className={styles.btnWrap}>
                                            <button
                                                className={styles.selectBtn(isSelected, isHovered)}
                                                style={btnTransitionStyle}
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