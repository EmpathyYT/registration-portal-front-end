import { supabase } from './supabaseClient';
import type { User, Team, TeamMember, Invitation, Reservation } from '../types/project';
import type { Course, CourseSection, EnrolledCourse } from '../types/registration';



// ════════════════════════════════════════════════════════════════
// 1. AUTHENTICATION
// ════════════════════════════════════════════════════════════════

export async function login(uniId: string, password: string): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: uniId,
        password,
    });
    if (authError) throw authError;

    const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id, full_name, university_id, role')
        .eq('id', authData.user.id)
        .single();
    if (profileError) throw profileError;

    return {
        user_id: profile.id,
        full_name: profile.full_name,
        university_id: profile.university_id,
        role: profile.role,
    };
}

export async function logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getCurrentSession(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data: profile, error } = await supabase
        .from('users')
        .select('id, full_name, university_id, role')
        .eq('id', session.user.id)
        .single();
    if (error) throw error;

    return {
        user_id: profile.id,
        full_name: profile.full_name,
        university_id: profile.university_id,
        role: profile.role,
    };
}


// ════════════════════════════════════════════════════════════════
// 2. COURSE REGISTRATION
// ════════════════════════════════════════════════════════════════

export async function getAvailableCourses(): Promise<Course[]> {
    const { data, error } = await supabase
        .from('courses')
        .select('id, name, credits, subject');
    if (error) throw error;

    return data.map((c: any) => ({
        course_id: String(c.id),
        name: c.name,
        credits: c.credits,
    }));
}

export async function getCourseSections(courseId: string): Promise<CourseSection[]> {
    const { data, error } = await supabase
        .from('semester_courses')
        .select(`
            id,
            course_id,
            instructor,
            sessions (
                session_id,
                location,
                time,
                day_of_week
            )
        `)
        .eq('course_id', courseId);
    if (error) throw error;

    return data.flatMap((sc: any) =>
        (sc.sessions ?? []).map((s: any) => ({
            semester_course_id: sc.id,
            course_id: String(sc.course_id),
            instructor_name: sc.instructor ?? '',
            lecture_time_in_day: s.time ?? '',
            days_of_week: s.day_of_week ?? '',
            location: s.location ?? '',
        }))
    );
}

export async function getStudentSchedule(userId: string): Promise<EnrolledCourse[]> {
    const { data, error } = await supabase
        .from('enrollments')
        .select(`
            semester_course_id,
            semester_courses (
                id,
                course_id,
                instructor,
                courses ( name, credits ),
                sessions (
                    time,
                    day_of_week,
                    location
                )
            )
        `)
        .eq('user_id', userId);
    if (error) throw error;

    return data.map((row: any) => {
        const sc = row.semester_courses;
        const session = sc.sessions?.[0] ?? {};
        return {
            semester_course_id: sc.id,
            course_id: String(sc.course_id),
            name: sc.courses?.name ?? '',
            credits: sc.courses?.credits ?? 0,
            instructor_name: sc.instructor ?? '',
            lecture_time_in_day: session.time ?? '',
            days_of_week: session.day_of_week ?? '',
            location: session.location ?? '',
        };
    });
}

export async function commitSchedule(userId: string, semesterCourseIds: number[]): Promise<void> {
    const rows = semesterCourseIds.map(id => ({
        user_id: userId,
        semester_course_id: id,
    }));
    const { error } = await supabase.from('enrollments').insert(rows);
    if (error) throw error;
}

export async function dropSection(userId: string, semesterCourseId: number): Promise<void> {
    const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('user_id', userId)
        .eq('semester_course_id', semesterCourseId);
    if (error) throw error;
}


// ════════════════════════════════════════════════════════════════
// 3. TEAM DISCOVERY
// ════════════════════════════════════════════════════════════════

export async function getAvailableTeams(): Promise<Team[]> {
    const { data, error } = await supabase
        .from('teams')
        .select(`
            id,
            project_title,
            status,
            min_users,
            max_users,
            introduction_link,
            supervisor_id,
            supervisor:users!supervisor_id ( full_name )
        `)
        .neq('status', 'Completed');
    if (error) throw error;

    return data.map((t: any) => ({
        team_id: t.id,
        project_title: t.project_title,
        status: t.status,
        min_users: t.min_users,
        max_users: t.max_users,
        introduction_link: t.introduction_link ?? '',
        supervisor_id: t.supervisor_id ?? '',
        supervisor_name: t.supervisor?.full_name,
    }));
}

export async function createTeam(projectTitle: string, userId: string): Promise<Team> {
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({ project_title: projectTitle, status: 'Recruiting', min_users: 1, max_users: 5 })
        .select('id, project_title, status, min_users, max_users, introduction_link, supervisor_id')
        .single();
    if (teamError) throw teamError;

    const { error: memberError } = await supabase
        .from('team_members')
        .insert({ team_id: team.id, user_id: userId, role: 'Team Leader' });
    if (memberError) throw memberError;

    return {
        team_id: team.id,
        project_title: team.project_title,
        status: team.status,
        min_users: team.min_users,
        max_users: team.max_users,
        introduction_link: team.introduction_link ?? '',
        supervisor_id: team.supervisor_id ?? '',
    };
}

export async function requestToJoinTeam(userId: string, teamId: number): Promise<void> {
    const { data: leader, error: leaderError } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId)
        .eq('role', 'Team Leader')
        .single();
    if (leaderError) throw leaderError;

    const { error } = await supabase
        .from('invitations')
        .insert({ sender_user_id: userId, receiver_user_id: leader.user_id });
    if (error) throw error;
}


// ════════════════════════════════════════════════════════════════
// 4. ACTIVE TEAM
// ════════════════════════════════════════════════════════════════

export async function getUserTeam(userId: string): Promise<Team | null> {
    const { data, error } = await supabase
        .from('team_members')
        .select(`
            team_id,
            teams (
                id,
                project_title,
                status,
                min_users,
                max_users,
                introduction_link,
                supervisor_id,
                supervisor:users!supervisor_id ( full_name )
            )
        `)
        .eq('user_id', userId)
        .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const t = data.teams as any;
    return {
        team_id: t.id,
        project_title: t.project_title,
        status: t.status,
        min_users: t.min_users,
        max_users: t.max_users,
        introduction_link: t.introduction_link ?? '',
        supervisor_id: t.supervisor_id ?? '',
        supervisor_name: t.supervisor?.full_name,
    };
}

export async function getTeamMembers(teamId: number): Promise<TeamMember[]> {
    const { data, error } = await supabase
        .from('team_members')
        .select(`
            team_id,
            role,
            users ( id, full_name, university_id, role )
        `)
        .eq('team_id', teamId);
    if (error) throw error;

    return data.map((row: any) => ({
        team_id: row.team_id,
        user_id: row.users.id,
        full_name: row.users.full_name,
        university_id: row.users.university_id,
        role: row.users.role,
        team_role: row.role,
    }));
}

export async function leaveTeam(userId: string, teamId: number): Promise<void> {
    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('user_id', userId)
        .eq('team_id', teamId);
    if (error) throw error;
}

export async function kickMember(teamId: number, memberUserId: string): Promise<void> {
    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', memberUserId);
    if (error) throw error;
}

export async function promoteToLeader(teamId: number, memberUserId: string): Promise<void> {
    const { error: demoteError } = await supabase
        .from('team_members')
        .update({ role: 'Member' })
        .eq('team_id', teamId)
        .eq('role', 'Team Leader');
    if (demoteError) throw demoteError;

    const { error: promoteError } = await supabase
        .from('team_members')
        .update({ role: 'Team Leader' })
        .eq('team_id', teamId)
        .eq('user_id', memberUserId);
    if (promoteError) throw promoteError;
}

export async function updateMemberRole(teamId: number, userId: string, newRole: string): Promise<void> {
    const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('team_id', teamId)
        .eq('user_id', userId);
    if (error) throw error;
}

export async function uploadTeamDocument(teamId: number, documentUrl: string): Promise<void> {
    const { error } = await supabase
        .from('teams')
        .update({ introduction_link: documentUrl })
        .eq('id', teamId);
    if (error) throw error;
}


// ════════════════════════════════════════════════════════════════
// 5. RESERVATIONS
// ════════════════════════════════════════════════════════════════

export async function getTeamReservations(teamId: number): Promise<Reservation[]> {
    const { data, error } = await supabase
        .from('reservations')
        .select('team_id, location, reservation_time')
        .eq('team_id', teamId)
        .order('reservation_time', { ascending: true });
    if (error) throw error;
    return data;
}

export async function bookPresentation(teamId: number, location: string, time: string): Promise<void> {
    const { error } = await supabase
        .from('reservations')
        .insert({ team_id: teamId, location, reservation_time: time });
    if (error) throw error;
}

export async function updatePresentation(
    teamId: number,
    oldTime: string,
    newLocation: string,
    newTime: string
): Promise<void> {
    const { error } = await supabase
        .from('reservations')
        .update({ location: newLocation, reservation_time: newTime })
        .eq('team_id', teamId)
        .eq('reservation_time', oldTime);
    if (error) throw error;
}

export async function deletePresentation(teamId: number, reservationTime: string): Promise<void> {
    const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('team_id', teamId)
        .eq('reservation_time', reservationTime);
    if (error) throw error;
}


// ════════════════════════════════════════════════════════════════
// 6. INVITATIONS (received by a student or supervisor)
// Team context: JOIN team_members ON sender_user_id to get sender's team
// ════════════════════════════════════════════════════════════════

export async function getPendingInvitations(userId: string): Promise<Invitation[]> {
    const { data: invites, error } = await supabase
        .from('invitations')
        .select(`
            sender_user_id,
            receiver_user_id,
            created_at,
            sender:users!sender_user_id ( full_name, university_id )
        `)
        .eq('receiver_user_id', userId);
    if (error) throw error;

    const enriched = await Promise.all(
        invites.map(async (inv: any) => {
            const { data: tm } = await supabase
                .from('team_members')
                .select('team_id')
                .eq('user_id', inv.sender_user_id)
                .maybeSingle();
            return {
                sender_user_id: inv.sender_user_id,
                receiver_user_id: inv.receiver_user_id,
                created_at: inv.created_at,
                sender_full_name: inv.sender?.full_name ?? '',
                sender_university_id: inv.sender?.university_id ?? '',
                team_id: tm?.team_id ?? null,
            };
        })
    );

    return enriched;
}

export async function sendInvitation(senderId: string, receiverUniId: string): Promise<void> {
    const { data: receiver, error: lookupError } = await supabase
        .from('users')
        .select('id')
        .eq('university_id', receiverUniId)
        .single();
    if (lookupError) throw lookupError;

    const { error } = await supabase
        .from('invitations')
        .insert({ sender_user_id: senderId, receiver_user_id: receiver.id });
    if (error) throw error;
}

export async function acceptInvitation(senderUserId: string, receiverUserId: string): Promise<void> {
    const { data: tm, error: tmError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', senderUserId)
        .single();
    if (tmError) throw tmError;

    const { error: joinError } = await supabase
        .from('team_members')
        .insert({ team_id: tm.team_id, user_id: receiverUserId, role: 'Member' });
    if (joinError) throw joinError;

    const { error: deleteError } = await supabase
        .from('invitations')
        .delete()
        .eq('sender_user_id', senderUserId)
        .eq('receiver_user_id', receiverUserId);
    if (deleteError) throw deleteError;
}

export async function declineInvitation(senderUserId: string, receiverUserId: string): Promise<void> {
    const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('sender_user_id', senderUserId)
        .eq('receiver_user_id', receiverUserId);
    if (error) throw error;
}


// ════════════════════════════════════════════════════════════════
// 7. JOIN REQUESTS (team leader receives requests from students)
// Team context: JOIN team_members ON receiver_user_id to get leader's team
// ════════════════════════════════════════════════════════════════

export async function getPendingJoinRequests(teamId: number): Promise<Invitation[]> {
    const { data: leader, error: leaderError } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId)
        .eq('role', 'Team Leader')
        .single();
    if (leaderError) throw leaderError;

    const { data: requests, error } = await supabase
        .from('invitations')
        .select(`
            sender_user_id,
            receiver_user_id,
            created_at,
            sender:users!sender_user_id ( full_name, university_id )
        `)
        .eq('receiver_user_id', leader.user_id);
    if (error) throw error;

    return requests.map((r: any) => ({
        sender_user_id: r.sender_user_id,
        receiver_user_id: r.receiver_user_id,
        created_at: r.created_at,
        sender_full_name: r.sender?.full_name ?? '',
        sender_university_id: r.sender?.university_id ?? '',
    }));
}

export async function acceptJoinRequest(applicantUserId: string, teamId: number): Promise<void> {
    const { data: leader, error: leaderError } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId)
        .eq('role', 'Team Leader')
        .single();
    if (leaderError) throw leaderError;

    const { error: joinError } = await supabase
        .from('team_members')
        .insert({ team_id: teamId, user_id: applicantUserId, role: 'Member' });
    if (joinError) throw joinError;

    const { error: deleteError } = await supabase
        .from('invitations')
        .delete()
        .eq('sender_user_id', applicantUserId)
        .eq('receiver_user_id', leader.user_id);
    if (deleteError) throw deleteError;
}

export async function declineJoinRequest(applicantUserId: string, teamId: number): Promise<void> {
    const { data: leader, error: leaderError } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId)
        .eq('role', 'Team Leader')
        .single();
    if (leaderError) throw leaderError;

    const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('sender_user_id', applicantUserId)
        .eq('receiver_user_id', leader.user_id);
    if (error) throw error;
}


// ════════════════════════════════════════════════════════════════
// 8. SUPERVISOR
// ════════════════════════════════════════════════════════════════

export async function getSupervisedTeams(supervisorId: string): Promise<Team[]> {
    const { data, error } = await supabase
        .from('teams')
        .select(`
            id,
            project_title,
            status,
            min_users,
            max_users,
            introduction_link,
            supervisor_id,
            supervisor:users!supervisor_id ( full_name )
        `)
        .eq('supervisor_id', supervisorId);
    if (error) throw error;

    return data.map((t: any) => ({
        team_id: t.id,
        project_title: t.project_title,
        status: t.status,
        min_users: t.min_users,
        max_users: t.max_users,
        introduction_link: t.introduction_link ?? '',
        supervisor_id: t.supervisor_id ?? '',
        supervisor_name: t.supervisor?.full_name,
    }));
}

export async function getUnsupervisedTeams(): Promise<Team[]> {
    const { data, error } = await supabase
        .from('teams')
        .select('id, project_title, status, min_users, max_users, introduction_link, supervisor_id')
        .is('supervisor_id', null);
    if (error) throw error;

    return data.map((t: any) => ({
        team_id: t.id,
        project_title: t.project_title,
        status: t.status,
        min_users: t.min_users,
        max_users: t.max_users,
        introduction_link: t.introduction_link ?? '',
        supervisor_id: '',
    }));
}

export async function setTeamSupervisor(teamId: number, supervisorId: string): Promise<void> {
    const { error } = await supabase
        .from('teams')
        .update({ supervisor_id: supervisorId })
        .eq('id', teamId);
    if (error) throw error;
}

export async function stopSupervising(teamId: number): Promise<void> {
    const { error } = await supabase
        .from('teams')
        .update({ supervisor_id: null })
        .eq('id', teamId);
    if (error) throw error;
}
