import { useState } from 'react';
import RegisteredCoursesTable from '../components/registration/RegisteredCoursesTable';
import CourseSectionsTable from '../components/registration/CourseSectionsTable';
import AvailableCoursesGrid from '../components/registration/AvailableCoursesGrid';
import type {Course, CourseSection, EnrolledCourse} from '../types/registration';

const INITIAL_AVAILABLE_COURSES: Course[] = [
    { course_id: '30801342', name: 'Systems Analysis and Design', credits: 3 },
    { course_id: '30801427', name: 'Computer Architecture', credits: 3 },
    { course_id: '30801211', name: 'Data Structures', credits: 3 },
    { course_id: '30801301', name: 'Database Systems', credits: 3 },
];

const MOCK_SECTIONS: Record<string, CourseSection[]> = {
    '30801342': [
        { semester_course_id: 101, course_id: '30801342', instructor_name: 'Dr. Emad Al-Shalabi', days_of_week: 'Sun, Mon, Tue, Wed', lecture_time_in_day: '08:30 - 10:00', location: 'E202 / ONLINE 1' },
        { semester_course_id: 102, course_id: '30801342', instructor_name: 'Dr. Ahmed Al-Salem', days_of_week: 'Mon, Tue', lecture_time_in_day: '10:00 - 11:30', location: 'IT-105' },
    ],
    '30801427': [
        { semester_course_id: 201, course_id: '30801427', instructor_name: 'Khaldoun Aref', days_of_week: 'Sun, Mon, Tue, Wed', lecture_time_in_day: '11:30 - 13:00', location: 'E302 / ONLINE 1' },
    ],
    '30801211': [
        { semester_course_id: 301, course_id: '30801211', instructor_name: 'Dr. Rania Mahmoud', days_of_week: 'Sun, Tue', lecture_time_in_day: '01:00 - 02:30', location: 'Lab 4' },
    ],
    '30801301': [
        { semester_course_id: 401, course_id: '30801301', instructor_name: 'Dr. Khaled Al-Omari', days_of_week: 'Sun, Mon, Tue, Wed', lecture_time_in_day: '09:30 - 10:30', location: 'Lab 2' },
        { semester_course_id: 402, course_id: '30801301', instructor_name: 'Dr. Manar Issa', days_of_week: 'Mon, Tue', lecture_time_in_day: '12:00 - 01:30', location: 'IT-201' },
    ],
};

export default function RegistrationA() {
    const [registeredCourses, setRegisteredCourses] = useState<EnrolledCourse[]>([
        {
            semester_course_id: 999,
            course_id: '30801100',
            name: 'Introduction to Programming',
            credits: 3,
            lecture_time_in_day: '08:30 - 10:00',
            days_of_week: 'Sun, Mon, Tue, Wed',
            instructor_name: 'Dr. Mohammed Ali',
            location: 'C101',
        },
    ]);

    const [selectedCourseId, setSelectedCourseId] = useState<string>('');

    const handleSelectCourse = (course_id: string) => {
        setSelectedCourseId(course_id);
    };

    const handleCloseSections = () => {
        setSelectedCourseId('');
    };

    const handleAddSection = (semester_course_id: number) => {
        const currentSections = MOCK_SECTIONS[selectedCourseId] || [];
        const sectionToAdd = currentSections.find(s => s.semester_course_id === semester_course_id);
        const courseInfo = INITIAL_AVAILABLE_COURSES.find(c => c.course_id === selectedCourseId);

        if (!sectionToAdd || !courseInfo) return;

        const isAlreadyRegistered = registeredCourses.some(c => c.course_id === selectedCourseId);
        if (isAlreadyRegistered) {
            alert('This course is already registered!');
            setSelectedCourseId('');
            return;
        }

        const newCourse: EnrolledCourse = {
            semester_course_id: sectionToAdd.semester_course_id,
            course_id: courseInfo.course_id,
            name: courseInfo.name,
            credits: courseInfo.credits,
            lecture_time_in_day: sectionToAdd.lecture_time_in_day,
            days_of_week: sectionToAdd.days_of_week,
            instructor_name: sectionToAdd.instructor_name,
            location: sectionToAdd.location,
        };

        setRegisteredCourses([...registeredCourses, newCourse]);
        setSelectedCourseId('');
    };

    const handleDropCourse = (semester_course_id: number) => {
        setRegisteredCourses(registeredCourses.filter(c => c.semester_course_id !== semester_course_id));
    };

    const selectedCourse = INITIAL_AVAILABLE_COURSES.find(c => c.course_id === selectedCourseId);

    return (
        <div className="min-vh-100 py-5" style={{ backgroundColor: '#f4f7f6' }}>
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bolder text-primary mb-2">Course Registration Portal</h2>
                </div>

                <RegisteredCoursesTable
                    courses={registeredCourses}
                    onDropCourse={handleDropCourse}
                />

                <AvailableCoursesGrid
                    courses={INITIAL_AVAILABLE_COURSES}
                    selectedCourseId={selectedCourseId}
                    onSelectCourse={handleSelectCourse}
                />

                {selectedCourseId && selectedCourse && (
                    <CourseSectionsTable
                        course={selectedCourse}
                        sections={MOCK_SECTIONS[selectedCourseId] || []}
                        onAddSection={handleAddSection}
                        onClose={handleCloseSections}
                    />
                )}
            </div>
        </div>
    );
}