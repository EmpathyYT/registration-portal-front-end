
import LogIn from "./pages/LogIn.tsx";
import RegistrationA from './pages/RegistrationA';
import ProjectDashboard from "./pages/ProjectDashboard.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';

type ActivePage = 'registration' | 'project';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>('registration');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActivePage('registration');
  };

  if (!isAuthenticated) {
    return <LogIn onLogin={handleLogin} />;
  }

  if (activePage === 'registration') {
    return (
      <RegistrationA
        onSwitchPage={() => setActivePage('project')}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <ProjectDashboard
      onSwitchPage={() => setActivePage('registration')}
      onLogout={handleLogout}
    />
  );
}

export default App;
