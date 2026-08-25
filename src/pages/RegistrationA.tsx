import { useEffect, useState } from 'react';
import RegisteredCoursesTable, { type CommitState } from '../components/registration/RegisteredCoursesTable';
import CourseSectionsTable from '../components/registration/CourseSectionsTable';
import AvailableCoursesGrid from '../components/registration/AvailableCoursesGrid';
import type { Course, CourseSection, EnrolledCourse } from '../types/registration';
import PageMenu from '../components/layout/PageMenu';
import FloatingNotice, { type NoticeState } from '../components/layout/FloatingNotice';
import * as api from '../lib/api';

type RegistrationAProps = {
    onSwitchPage: () => void;
    onLogout: () => void;
    isDark: boolean;
    onToggleDark: () => void;
};

const hasTimeConflict = (days1: string, time1: string, days2: string, time2: string) => {
    const d1 = days1.split(',').map(d => d.trim());
    const d2 = days2.split(',').map(d => d.trim());
    if (!d1.some(day => d2.includes(day))) return false;

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

export default function RegistrationA({ onSwitchPage, onLogout, isDark, onToggleDark }: RegistrationAProps) {
    const [notice, setNotice] = useState<NoticeState>(null);
    const [currentUserId, setCurrentUserId] = useState('');
    const [loading, setLoading] = useState(true);

    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [registeredCourses, setRegisteredCourses] = useState<EnrolledCourse[]>([]);
    const [sections, setSections] = useState<CourseSection[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [commitState, setCommitState] = useState<CommitState>('clean');

    useEffect(() => {
        if (!notice) return;
        const id = window.setTimeout(() => setNotice(null), 2600);
        return () => window.clearTimeout(id);
    }, [notice]);

    useEffect(() => {
        async function load() {
            try {
                const session = await api.getCurrentSession();
                if (!session) return;
                setCurrentUserId(session.user_id);

                const [courses, schedule] = await Promise.all([
                    api.getAvailableCourses(),
                    api.getStudentSchedule(session.user_id),
                ]);
                setAvailableCourses(courses);
                setRegisteredCourses(schedule);
            } catch {
                setNotice({ type: 'error', message: 'Failed to load data.' });
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleSelectCourse = async (courseId: string) => {
        setSelectedCourseId(courseId);
        setNotice({ type: 'info', message: 'Loading sections...' });
        try {
            const data = await api.getCourseSections(courseId);
            setSections(data);
        } catch {
            setNotice({ type: 'error', message: 'Failed to load sections.' });
        }
    };

    const handleCloseSections = () => {
        setSelectedCourseId('');
        setSections([]);
    };

    const handleAddSection = (semesterCourseId: number) => {
        const sectionToAdd = sections.find(s => s.semester_course_id === semesterCourseId);
        const courseInfo = availableCourses.find(c => c.course_id === selectedCourseId);
        if (!sectionToAdd || !courseInfo) return;

        if (registeredCourses.some(c => c.course_id === selectedCourseId)) {
            setNotice({ type: 'error', message: 'This course is already registered.' });
            setSelectedCourseId('');
            return;
        }

        const conflict = registeredCourses.find(c =>
            hasTimeConflict(sectionToAdd.days_of_week, sectionToAdd.lecture_time_in_day, c.days_of_week, c.lecture_time_in_day)
        );
        if (conflict) {
            setNotice({ type: 'error', message: `Time conflict with "${conflict.name}" (${conflict.lecture_time_in_day}).` });
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

        setRegisteredCourses(prev => [...prev, newCourse]);
        setSelectedCourseId('');
        setSections([]);
        setCommitState('dirty');
        setNotice({ type: 'success', message: `${newCourse.name} added to draft.` });
    };

    const handleDropCourse = async (semesterCourseId: number) => {
        const dropped = registeredCourses.find(c => c.semester_course_id === semesterCourseId);
        try {
            await api.dropSection(currentUserId, semesterCourseId);
            setRegisteredCourses(prev => prev.filter(c => c.semester_course_id !== semesterCourseId));
            setCommitState('dirty');
            if (dropped) setNotice({ type: 'info', message: `${dropped.name} removed.` });
        } catch {
            setNotice({ type: 'error', message: 'Failed to drop course.' });
        }
    };

    const handleCommitSchedule = async () => {
        setCommitState('committing');
        setNotice({ type: 'info', message: 'Saving schedule...' });
        try {
            const draftIds = registeredCourses.map(c => c.semester_course_id);
            await api.commitSchedule(currentUserId, draftIds);
            setCommitState('success');
            setNotice({ type: 'success', message: 'Schedule saved successfully.' });
            setTimeout(() => setCommitState('clean'), 2000);
        } catch {
            setCommitState('dirty');
            setNotice({ type: 'error', message: 'Failed to save schedule.' });
        }
    };

    const selectedCourse = availableCourses.find(c => c.course_id === selectedCourseId);

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 pb-5 page-body">
            <PageMenu switchLabel="Project Page" onSwitchPage={onSwitchPage} onLogout={onLogout} isDark={isDark} onToggleDark={onToggleDark} />
            <FloatingNotice notice={notice} />
            <div className="container container-main">
                <div className="text-center mb-5 fade-up">
                    <h1 className="fw-bolder mb-1 page-title" style={{ letterSpacing: '-0.5px' }}>Course Registration Portal</h1>
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
                        courses={availableCourses}
                        selectedCourseId={selectedCourseId}
                        onSelectCourse={handleSelectCourse}
                    />
                </div>

                {selectedCourseId && selectedCourse && (
                    <CourseSectionsTable
                        course={selectedCourse}
                        sections={sections}
                        onAddSection={handleAddSection}
                        onClose={handleCloseSections}
                    />
                )}
            </div>
        </div>
    );
}