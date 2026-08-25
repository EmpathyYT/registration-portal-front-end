import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import LogIn from "./pages/LogIn.tsx";
import RegistrationA from './pages/RegistrationA';
import ProjectDashboard from "./pages/ProjectDashboard.tsx";

type ActivePage = 'registration' | 'project';
export type UserRole = 'student' | 'supervisor';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>('registration');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [isDark, toggleDark] = useDarkMode();

  const handleLogin = (role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
    // Supervisors always land on the project dashboard
    if (role === 'supervisor') setActivePage('project');
    else setActivePage('registration');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActivePage('registration');
    setUserRole('student');
  };

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
