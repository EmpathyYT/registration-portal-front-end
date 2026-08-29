import { authRepository } from '../features/auth/repositories/auth_repository';
import { coursesRepository } from '../features/courses/repositories/courses_repository';
import { reservationsRepository } from '../features/reservations/repositories/reservations_repository';
import { teamsRepository } from '../features/teams/repositories/teams_repository';

import type { User, Team, TeamMember, Invitation, Reservation } from '../types/project';
import type { Course, CourseSection, EnrolledCourse } from '../types/registration';

export async function login(uniId: string, password: string): Promise<User> {
    const userDto = await authRepository.login(uniId, password);
    return {
        user_id: userDto.user_id,
        full_name: userDto.full_name,
        university_id: userDto.university_id,
        role: userDto.role === 'teacher' ? 'supervisor' : 'student',
    };
}

export async function logout(): Promise<void> {
    return authRepository.logout();
}

export async function getCurrentSession(): Promise<User | null> {
    const userDto = await authRepository.getCurrentSession();
    if (!userDto) return null;
    return {
        user_id: userDto.user_id,
        full_name: userDto.full_name,
        university_id: userDto.university_id,
        role: userDto.role === 'teacher' ? 'supervisor' : 'student',
    };
}

export async function getAvailableCourses(): Promise<Course[]> {
    const courses = await coursesRepository.getAvailableCourses();
    return courses.map(c => ({
        course_id: String(c.course_id),
        name: c.name,
        credits: c.credits,
    }));
}

export async function getCourseSections(courseId: number | string): Promise<CourseSection[]> {
    const cid = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId;
    const sections = await coursesRepository.getCourseSections(cid);
    
    // Map SemesterCourseDto into CourseSection
    const result: CourseSection[] = [];
    for (const sc of sections) {
        if (sc.sessions.length === 0) continue;
        const days = sc.sessions.map(s => s.day_of_week).join(', ');
        const firstSession = sc.sessions[0];
        result.push({
            semester_course_id: sc.semester_course_id,
            instructor_name: sc.instructor_id,
            days_of_week: days,
            lecture_time_in_day: `${firstSession.time} - ${firstSession.end_time}`,
            location: firstSession.location,
        });
    }
    return result;
}

export async function getStudentSchedule(userId: string): Promise<EnrolledCourse[]> {
    const enrollments = await coursesRepository.getStudentSchedule(userId);
    const availableCourses = await coursesRepository.getAvailableCourses();
    
    const result: EnrolledCourse[] = [];
    
    for (const e of enrollments) {
        // Need to find the course details. We have to search through sections.
        let foundSection: any = null;
        let foundCourse: any = null;
        let foundSession: any = null;
        
        for (const course of availableCourses) {
            const sections = await coursesRepository.getCourseSections(course.course_id);
            const section = sections.find(s => s.semester_course_id === e.semester_course_id);
            if (section) {
                foundSection = section;
                foundCourse = course;
                foundSession = section.sessions[0];
                break;
            }
        }
        
        if (foundSection && foundCourse && foundSession) {
            const days = foundSection.sessions.map((s: any) => s.day_of_week).join(', ');
            result.push({
                semester_course_id: e.semester_course_id,
                course_id: String(foundCourse.course_id),
                name: foundCourse.name,
                credits: foundCourse.credits,
                instructor_name: foundSection.instructor_id,
                days_of_week: days,
                lecture_time_in_day: `${foundSession.time} - ${foundSession.end_time}`,
                location: foundSession.location,
            });
        }
    }
    return result;
}

export async function commitSchedule(userId: string, semesterCourseIds: number[]): Promise<void> {
    return coursesRepository.commitSchedule(userId, semesterCourseIds);
}

export async function dropSection(userId: string, semesterCourseId: number): Promise<void> {
    return coursesRepository.dropSection(userId, semesterCourseId);
}

export async function getAvailableTeams(): Promise<Team[]> {
    const teams = await teamsRepository.getAvailableTeams();
    return Promise.all(teams.map(async t => {
        const members = await teamsRepository.getTeamMembers(t.team_id);
        return {
            team_id: t.team_id,
            project_title: t.project_title,
            status: t.status as any,
            min_users: t.min_users,
            max_users: t.max_users,
            introduction_link: t.introduction_link,
            supervisor_id: t.supervisor_id,
            member_count: members.length,
        };
    }));
}

export async function createTeam(projectTitle: string, userId: string): Promise<Team> {
    const t = await teamsRepository.createTeam(projectTitle, userId);
    return {
        team_id: t.team_id,
        project_title: t.project_title,
        status: t.status as any,
        min_users: t.min_users,
        max_users: t.max_users,
        introduction_link: t.introduction_link,
        supervisor_id: t.supervisor_id,
        member_count: 1,
    };
}

export async function requestToJoinTeam(userId: string, teamId: number): Promise<void> {
    return teamsRepository.requestToJoinTeam(userId, teamId);
}

export async function getUserTeam(userId: string): Promise<Team | null> {
    const t = await teamsRepository.getUserTeam(userId);
    if (!t) return null;
    const members = await teamsRepository.getTeamMembers(t.team_id);
    return {
        team_id: t.team_id,
        project_title: t.project_title,
        status: t.status as any,
        min_users: t.min_users,
        max_users: t.max_users,
        introduction_link: t.introduction_link,
        supervisor_id: t.supervisor_id,
        member_count: members.length,
    };
}

export async function getTeamMembers(teamId: number): Promise<TeamMember[]> {
    const members = await teamsRepository.getTeamMembers(teamId);
    return members.map(m => ({
        team_id: m.team_id,
        user_id: m.user_id,
        full_name: m.user_id === 'user1' ? 'Ammar Ahmad Sameed' : `User ${m.user_id}`,
        university_id: m.user_id === 'user1' ? '123456' : m.user_id,
        team_role: m.role,
    }));
}

export async function leaveTeam(userId: string, teamId: number): Promise<void> {
    return teamsRepository.leaveTeam(userId, teamId);
}

export async function kickMember(teamId: number, memberUserId: string): Promise<void> {
    return teamsRepository.kickMember(teamId, memberUserId);
}

export async function promoteToLeader(teamId: number, memberUserId: string): Promise<void> {
    return teamsRepository.promoteToLeader(teamId, memberUserId);
}

export async function updateMemberRole(teamId: number, userId: string, newRole: string): Promise<void> {
    return teamsRepository.updateMemberRole(teamId, userId, newRole);
}

export async function uploadTeamDocument(teamId: number, documentUrl: string): Promise<void> {
    return teamsRepository.uploadTeamDocument(teamId, documentUrl);
}

export async function getPendingInvitations(userId: string): Promise<Invitation[]> {
    const invites = await teamsRepository.getPendingInvitations(userId);
    return invites.map(i => ({
        sender_user_id: i.sender_user_id,
        receiver_user_id: i.receiver_user_id,
        sender_full_name: i.sender_user_id === 'user1' ? 'Ammar Ahmad Sameed' : `User ${i.sender_user_id}`,
        sender_university_id: i.sender_user_id === 'user1' ? '123456' : i.sender_user_id,
        created_at: i.created_at,
        invitation_type: i.invitation_type,
    }));
}

export async function sendInvitation(senderId: string, receiverUniId: string): Promise<void> {
    return teamsRepository.sendInvitation(senderId, receiverUniId);
}

export async function acceptInvitation(senderUserId: string, receiverUserId: string): Promise<void> {
    return teamsRepository.acceptInvitation(senderUserId, receiverUserId);
}

export async function declineInvitation(senderUserId: string, receiverUserId: string): Promise<void> {
    return teamsRepository.declineInvitation(senderUserId, receiverUserId);
}

export async function getPendingJoinRequests(teamId: number): Promise<Invitation[]> {
    const requests = await teamsRepository.getPendingJoinRequests(teamId);
    return requests.map(i => ({
        sender_user_id: i.sender_user_id,
        receiver_user_id: i.receiver_user_id,
        sender_full_name: i.sender_user_id === 'user1' ? 'Ammar Ahmad Sameed' : `User ${i.sender_user_id}`,
        sender_university_id: i.sender_user_id === 'user1' ? '123456' : i.sender_user_id,
        created_at: i.created_at,
        invitation_type: i.invitation_type,
    }));
}

export async function acceptJoinRequest(applicantUserId: string, teamId: number): Promise<void> {
    return teamsRepository.acceptJoinRequest(applicantUserId, teamId);
}

export async function declineJoinRequest(applicantUserId: string, teamId: number): Promise<void> {
    return teamsRepository.declineJoinRequest(applicantUserId, teamId);
}

export async function getTeamReservations(teamId: number): Promise<Reservation[]> {
    const r = await reservationsRepository.getTeamReservation(teamId);
    if (!r) return [];
    return [{
        team_id: r.team_id,
        location: r.location,
        reservation_time: r.reservation_time,
    }];
}

export async function bookPresentation(teamId: number, location: string, time: string): Promise<Reservation> {
    const r = await reservationsRepository.bookPresentation(teamId, location, time);
    return {
        team_id: r.team_id,
        location: r.location,
        reservation_time: r.reservation_time,
    };
}

export async function updatePresentation(teamId: number, oldTime: string, newLocation: string, newTime: string): Promise<void> {
    return reservationsRepository.updatePresentation(teamId, oldTime, newLocation, newTime);
}

export async function deletePresentation(teamId: number, reservationTime: string): Promise<void> {
    return reservationsRepository.deletePresentation(teamId, reservationTime);
}

export async function getSupervisors(): Promise<User[]> {
    return [
        {
            user_id: 'teacher1',
            full_name: 'Dr. Rania Mahmoud',
            university_id: 'teacher1',
            role: 'supervisor'
        }
    ];
}

export async function getSupervisedTeams(supervisorId: string): Promise<Team[]> {
    const teams = await teamsRepository.getSupervisedTeams(supervisorId);
    return Promise.all(teams.map(async t => {
        const members = await teamsRepository.getTeamMembers(t.team_id);
        return {
            team_id: t.team_id,
            project_title: t.project_title,
            status: t.status as any,
            min_users: t.min_users,
            max_users: t.max_users,
            introduction_link: t.introduction_link,
            supervisor_id: t.supervisor_id,
            member_count: members.length,
        };
    }));
}

export async function getUnsupervisedTeams(): Promise<Team[]> {
    const teams = await teamsRepository.getUnsupervisedTeams();
    return Promise.all(teams.map(async t => {
        const members = await teamsRepository.getTeamMembers(t.team_id);
        return {
            team_id: t.team_id,
            project_title: t.project_title,
            status: t.status as any,
            min_users: t.min_users,
            max_users: t.max_users,
            introduction_link: t.introduction_link,
            supervisor_id: t.supervisor_id,
            member_count: members.length,
        };
    }));
}

export async function setTeamSupervisor(teamId: number, supervisorId: string): Promise<void> {
    return teamsRepository.setTeamSupervisor(teamId, supervisorId);
}

export async function stopSupervising(teamId: number): Promise<void> {
    return teamsRepository.stopSupervising(teamId);
}
