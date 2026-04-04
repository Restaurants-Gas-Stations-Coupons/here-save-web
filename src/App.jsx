import React, { useState, useEffect } from 'react';
import './i18n'; // Import i18n configuration
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Coupons from './pages/Coupons';
import StaffMembers from './pages/StaffMembers';
import { fetchCurrentUser } from './services/authService';
import ToastHost from './components/ui/ToastHost';

/** Client-side “pages” only — no browser full reload when switching dashboard / coupons / staff. */
function App() {
  const [page, setPage] = useState('login');
  const [userRole, setUserRole] = useState(null); // 'admin' | 'superadmin'
  const [currentUser, setCurrentUser] = useState(null);

  // Restore session on initial load if we have a stored access token
  useEffect(() => {
    const restoreSession = async () => {
      const token = window.localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const user = await fetchCurrentUser(token);
        const backendRole = user?.role;
        const mappedRole = backendRole === 'SUPER_ADMIN' ? 'superadmin' : 'admin';
        setCurrentUser(user || null);
        setUserRole(mappedRole);
        setPage('dashboard');
      } catch {
        // Token is invalid/expired; clear it so we don't loop on errors
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('refreshToken');
      }
    };

    restoreSession();
  }, []);

  const handleLoginSuccess = (role = 'admin', user = null) => {
    if (user) setCurrentUser(user);
    setUserRole(role);
    setPage('dashboard');
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard userRole={userRole} currentUser={currentUser} onNavigate={(p) => setPage(p)} />;
      case 'coupons':
        return <Coupons userRole={userRole} currentUser={currentUser} onNavigate={(p) => setPage(p)} />;
      case 'staff':
        return <StaffMembers userRole={userRole} currentUser={currentUser} onNavigate={(p) => setPage(p)} />;
      default:
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="App min-h-screen bg-white">
      <ToastHost />
      {renderPage()}
    </div>
  );
}

export default App;
