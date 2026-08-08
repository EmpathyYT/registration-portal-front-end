import React from 'react';

export interface EnrolledCourse {
    semesterCourseId: string | number;
    courseId: string;
    courseName: string;
    credits: number;
    lectureTime: string;
    dayOfWeek: string;
    instructor: string;
    location: string;
}

interface RegisteredCourseRowProps {
    course: EnrolledCourse;
    onDrop: (semesterCourseId: string | number) => void;
}

export const RegisteredCourseRow: React.FC<RegisteredCourseRowProps> = ({ course, onDrop }) => {
    return (
        <tr>
            {/* 1. رقم المادة */}
            <td>{course.courseId}</td>
            {/* 2. اسم المادة */}
            <td>{course.courseName}</td>
            {/* 3. عدد الساعات */}
            <td>{course.credits}</td>
            {/* 4. الأيام */}
            <td>{course.dayOfWeek}</td>
            {/* 5. الوقت */}
            <td>{course.lectureTime}</td>
            {/* 6. المدرس */}
            <td>{course.instructor}</td>
            {/* 7. القاعة */}
            <td>{course.location}</td>
            {/* 8. الإجراء (زر Drop الأحمر) */}
            <td>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDrop(course.semesterCourseId)}
                >
                    Drop
                </button>
            </td>
        </tr>
    );
};

export default RegisteredCourseRow;