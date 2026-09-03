import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useEffect, useState } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import LogIn from "./pages/LogIn.tsx";
import RegistrationA from './pages/RegistrationA';
import ProjectDashboard from "./pages/ProjectDashboard.tsx";
import { authRepository } from './features/auth/repositories/auth_repository';


type ActivePage = 'registration' | 'project';
export type UserRole = 'student' | 'supervisor';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [activePage, setActivePage] = useState<ActivePage>('registration');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [isDark, toggleDark] = useDarkMode();

  // Persist the active page so a browser refresh keeps the student on the same page.
  // Guard: only save AFTER init is done — otherwise the default 'registration' value
  // would overwrite the saved page before the session restore even reads it.
  useEffect(() => {
    if (!initializing) {
      sessionStorage.setItem('activePage', activePage);
    }
  }, [activePage, initializing]);

  // On mount, restore session from Supabase's persisted token so a page
  // refresh doesn't force the user to log in again.
  useEffect(() => {
    authRepository.getCurrentSession()
      .then(session => {
        if (session) {
          const role: UserRole = session.role === 'teacher' ? 'supervisor' : 'student';
          // Supervisors always land on project. Students restore their last page.
          const savedPage = sessionStorage.getItem('activePage') as ActivePage | null;
          const restoredPage: ActivePage =
            role === 'supervisor' ? 'project' : (savedPage ?? 'registration');
          setIsAuthenticated(true);
          setUserRole(role);
          setActivePage(restoredPage);
        }
      })
      .catch(() => { /* no session — stay on login */ })
      .finally(() => setInitializing(false));
  }, []);

  const handleLogin = (role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
    // Supervisors always land on the project dashboard
    if (role === 'supervisor') setActivePage('project');
    else setActivePage('registration');
  };

  const handleLogout = async () => {
    try { await authRepository.logout(); } catch { /* ignore */ }
    sessionStorage.removeItem('activePage'); // clear saved page on logout
    setIsAuthenticated(false);
    setActivePage('registration');
    setUserRole('student');
  };


  if (initializing) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LogIn onLogin={handleLogin} isDark={isDark} onToggleDark={toggleDark} />;
  }

  if (activePage === 'registration') {
    return (
      <RegistrationA
        onSwitchPage={() => setActivePage('project')}
        onLogout={handleLogout}
        isDark={isDark}
        onToggleDark={toggleDark}
      />
    );
  }

  return (
    <ProjectDashboard
      // Supervisors are locked to this page — no switch button
      onSwitchPage={userRole === 'supervisor' ? undefined : () => setActivePage('registration')}
      onLogout={handleLogout}
      isDark={isDark}
      onToggleDark={toggleDark}
      userRole={userRole}
    />
  );
}

export default App;
