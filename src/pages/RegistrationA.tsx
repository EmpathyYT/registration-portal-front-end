import { useEffect, useState } from 'react';
import RegisteredCoursesTable, { type CommitState } from '../components/registration/RegisteredCoursesTable';
import CourseSectionsTable from '../components/registration/CourseSectionsTable';
import AvailableCoursesGrid from '../components/registration/AvailableCoursesGrid';
import type { Course, CourseSection, EnrolledCourse } from '../types/registration';
import PageMenu from '../components/layout/PageMenu';
import FloatingNotice, { type NoticeState } from '../components/layout/FloatingNotice';
import { authRepository } from '../features/auth/repositories/auth_repository';
import { coursesRepository } from '../features/courses/repositories/courses_repository';

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
                const session = await authRepository.getCurrentSession();
                if (!session) return;
                setCurrentUserId(session.user_id);

                const [courseDtos, enrollmentDtos] = await Promise.all([
                    coursesRepository.getAvailableCourses(),
                    coursesRepository.getStudentSchedule(session.user_id),
                ]);

                // Map CourseDto → Course (course_id is number in DTO; stringify for local type)
                const courses: Course[] = courseDtos.map(c => ({
                    course_id: String(c.course_id),
                    name: c.name,
                    credits: c.credits,
                }));
                setAvailableCourses(courses);

                // EnrollmentDto only has user_id + semester_course_id.
                // Fetch sections for each enrolled course to build full EnrolledCourse objects.
                if (enrollmentDtos.length > 0) {
                    const sectionPromises = courseDtos.map(c =>
                        coursesRepository.getCourseSections(c.course_id)
                    );
                    const allSectionGroups = await Promise.all(sectionPromises);

                    // Build a flat lookup: semester_course_id → { courseDto, sectionDto }
                    const sectionLookup = new Map<number, { courseId: number; courseName: string; credits: number; instructorId: string; daysOfWeek: string; lectureTime: string; location: string }>();
                    courseDtos.forEach((courseDto, idx) => {
                        allSectionGroups[idx].forEach(sectionDto => {
                            const firstSession = sectionDto.sessions[0];
                            sectionLookup.set(sectionDto.semester_course_id, {
                                courseId: courseDto.course_id,
                                courseName: courseDto.name,
                                credits: courseDto.credits,
                                instructorId: sectionDto.instructor_id,
                                daysOfWeek: firstSession?.day_of_week ?? '',
                                lectureTime: firstSession ? `${firstSession.time}-${firstSession.end_time}` : '',
                                location: firstSession?.location ?? '',
                            });
                        });
                    });

                    const enrolled: EnrolledCourse[] = enrollmentDtos
                        .map(e => {
                            const info = sectionLookup.get(e.semester_course_id);
                            if (!info) return null;
                            return {
                                semester_course_id: e.semester_course_id,
                                course_id: String(info.courseId),
                                name: info.courseName,
                                credits: info.credits,
                                instructor_name: info.instructorId,
                                days_of_week: info.daysOfWeek,
                                lecture_time_in_day: info.lectureTime,
                                location: info.location,
                            } satisfies EnrolledCourse;
                        })
                        .filter((e): e is EnrolledCourse => e !== null);
                    setRegisteredCourses(enrolled);
                }
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
            const sectionDtos = await coursesRepository.getCourseSections(Number(courseId));
            // Map SemesterCourseDto → CourseSection (flatten sessions into flat fields)
            const mapped: CourseSection[] = sectionDtos.map(s => {
                const firstSession = s.sessions[0];
                return {
                    semester_course_id: s.semester_course_id,
                    instructor_name: s.instructor_id,
                    days_of_week: firstSession?.day_of_week ?? '',
                    lecture_time_in_day: firstSession ? `${firstSession.time}-${firstSession.end_time}` : '',
                    location: firstSession?.location ?? '',
                };
            });
            setSections(mapped);
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
            await coursesRepository.dropSection(currentUserId, semesterCourseId);
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
            await coursesRepository.commitSchedule(currentUserId, draftIds);
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
            <PageMenu switchLabel="Project Page" onSwitchPage={onSwitchPage} onLogout={onLogout} isDark={isDark} onToggleDark={onToggleDark} userRole="student" />
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