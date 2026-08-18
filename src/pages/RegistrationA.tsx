import { useState } from 'react';
import RegisteredCoursesTable, {type CommitState } from '../components/registration/RegisteredCoursesTable';
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

// --- TIME CONFLICT HELPER ALGORITHM ---
const hasTimeConflict = (days1: string, time1: string, days2: string, time2: string) => {
    // Check if they share any days
    const d1 = days1.split(',').map(d => d.trim());
    const d2 = days2.split(',').map(d => d.trim());
    const sharesDay = d1.some(day => d2.includes(day));

    if (!sharesDay) return false;

    // Helper to convert "HH:MM" to minutes since midnight for easy range checking
    const parseTime = (timeStr: string) => {
        const [start, end] = timeStr.split('-').map(t => t.trim());
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        return { startMins: startH * 60 + startM, endMins: endH * 60 + endM };
    };

    const t1 = parseTime(time1);
    const t2 = parseTime(time2);

    // Two time ranges overlap if (Start A < End B) AND (Start B < End A)
    return t1.startMins < t2.endMins && t2.startMins < t1.endMins;
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
    const [commitState, setCommitState] = useState<CommitState>('clean');

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

        // 1. Check Duplicate Course
        const isAlreadyRegistered = registeredCourses.some(c => c.course_id === selectedCourseId);
        if (isAlreadyRegistered) {
            alert('This course is already registered!');
            setSelectedCourseId('');
            return;
        }

        // 2. Check Time Conflicts
        const conflictCourse = registeredCourses.find(c =>
            hasTimeConflict(sectionToAdd.days_of_week, sectionToAdd.lecture_time_in_day, c.days_of_week, c.lecture_time_in_day)
        );

        if (conflictCourse) {
            alert(`This section overlaps with your currently registered course:\n"${conflictCourse.name}" (${conflictCourse.lecture_time_in_day})`);
            setSelectedCourseId('');
            return;
        }

        // 3. Add to Schedule
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
        setCommitState('dirty');
    };

    const handleDropCourse = (semester_course_id: number) => {
        setRegisteredCourses(registeredCourses.filter(c => c.semester_course_id !== semester_course_id));
        setCommitState('dirty');
    };

    const handleCommitSchedule = () => {
        setCommitState('committing');

        setTimeout(() => {
            console.log("Committed to DB:", registeredCourses);
            setCommitState('success');

            setTimeout(() => {
                setCommitState('clean');
            }, 2000);

        }, 1500);
    };

    const selectedCourse = INITIAL_AVAILABLE_COURSES.find(c => c.course_id === selectedCourseId);

    return (
        <div className="min-vh-100 pb-5" style={{ backgroundColor: '#f8f9fc', paddingTop: '4rem' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                <div className="text-center mb-5">
                    <h1 className="fw-bolder text-success mb-2" style={{ letterSpacing: '-0.5px' }}>Course Registration Portal</h1>
                </div>

                <RegisteredCoursesTable
                    courses={registeredCourses}
                    onDropCourse={handleDropCourse}
                    onCommit={handleCommitSchedule}
                    commitState={commitState}
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