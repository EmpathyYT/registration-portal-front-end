import { useEffect, useState } from 'react';
import RegisteredCoursesTable, {type CommitState } from '../components/registration/RegisteredCoursesTable';
import CourseSectionsTable from '../components/registration/CourseSectionsTable';
import AvailableCoursesGrid from '../components/registration/AvailableCoursesGrid';
import type {Course, CourseSection, EnrolledCourse} from '../types/registration';
import PageMenu from '../components/layout/PageMenu';
import FloatingNotice, { type NoticeState } from '../components/layout/FloatingNotice';

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

const hasTimeConflict = (days1: string, time1: string, days2: string, time2: string) => {
    
    const d1 = days1.split(',').map(d => d.trim());
    const d2 = days2.split(',').map(d => d.trim());
    const sharesDay = d1.some(day => d2.includes(day));

    if (!sharesDay) return false;

    const parseTime = (timeStr: string) => {
        const [start, end] = timeStr.split('-').map(t => t.trim());
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        return { startMins: startH * 60 + startM, endMins: endH * 60 + endM };
    };

    const t1 = parseTime(time1);
    const t2 = parseTime(time2);

    return t1.startMins < t2.endMins && t2.startMins < t1.endMins;
};

type RegistrationAProps = {
    onSwitchPage: () => void;
    onLogout: () => void;
};

export default function RegistrationA({ onSwitchPage, onLogout }: RegistrationAProps) {
    const [notice, setNotice] = useState<NoticeState>(null);
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

    useEffect(() => {
        if (!notice) return;
        const timeoutId = window.setTimeout(() => setNotice(null), 2600);
        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    const handleSelectCourse = (course_id: string) => {
        setSelectedCourseId(course_id);
        setNotice({ type: 'info', message: 'Loading sections...' });
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
            setNotice({ type: 'error', message: 'This course is already registered.' });
            setSelectedCourseId('');
            return;
        }

        const conflictCourse = registeredCourses.find(c =>
            hasTimeConflict(sectionToAdd.days_of_week, sectionToAdd.lecture_time_in_day, c.days_of_week, c.lecture_time_in_day)
        );

        if (conflictCourse) {
            setNotice({
                type: 'error',
                message: `Time conflict with "${conflictCourse.name}" (${conflictCourse.lecture_time_in_day}).`
            });
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
        setCommitState('dirty');
        setNotice({ type: 'success', message: `${newCourse.name} was added.` });
    };

    const handleDropCourse = (semester_course_id: number) => {
        const droppedCourse = registeredCourses.find(c => c.semester_course_id === semester_course_id);
        setRegisteredCourses(registeredCourses.filter(c => c.semester_course_id !== semester_course_id));
        setCommitState('dirty');
        if (droppedCourse) {
            setNotice({ type: 'info', message: `${droppedCourse.name} was removed.` });
        }
    };

    const handleCommitSchedule = () => {
        setCommitState('committing');
        setNotice({ type: 'info', message: 'Saving schedule...' });

        setTimeout(() => {
            console.log("Committed to DB:", registeredCourses);
            setCommitState('success');
            setNotice({ type: 'success', message: 'Schedule saved successfully.' });

            setTimeout(() => {
                setCommitState('clean');
            }, 2000);

        }, 1500);
    };

    const selectedCourse = INITIAL_AVAILABLE_COURSES.find(c => c.course_id === selectedCourseId);

    return (
        <div className="min-vh-100 pb-5" style={{ paddingTop: '5.5rem' }}>
            <PageMenu switchLabel="Project Page" onSwitchPage={onSwitchPage} onLogout={onLogout} />
            <FloatingNotice notice={notice} />
            <div className="container" style={{ maxWidth: '1100px' }}>
                <div className="text-center mb-5 fade-up">
                    
                    <h1 className="fw-bolder mb-1" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>Course Registration Portal</h1>
                    <p className="text-muted mb-0">Manage your semester schedule below.</p>
                </div>

                <div className="section-enter">
                    <RegisteredCoursesTable
                        courses={registeredCourses}
                        onDropCourse={handleDropCourse}
                        onCommit={handleCommitSchedule}
                        commitState={commitState}
                    />
                </div>

                <div className="section-enter">
                    <AvailableCoursesGrid
                        courses={INITIAL_AVAILABLE_COURSES}
                        selectedCourseId={selectedCourseId}
                        onSelectCourse={handleSelectCourse}
                    />
                </div>

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