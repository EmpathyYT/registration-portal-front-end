import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import LogIn from "./pages/LogIn.tsx";
import RegistrationA from './pages/RegistrationA';
import ProjectDashboard from "./pages/ProjectDashboard.tsx";

type ActivePage = 'registration' | 'project';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>('registration');
  const [isDark, toggleDark] = useDarkMode();

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActivePage('registration');
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
      onSwitchPage={() => setActivePage('registration')}
      onLogout={handleLogout}
      isDark={isDark}
      onToggleDark={toggleDark}
    />
  );
}

export default App;
