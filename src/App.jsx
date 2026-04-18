import React, { useState, useEffect } from 'react';
import './i18n'; // Import i18n configuration
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Coupons from './pages/Coupons';
import StaffMembers from './pages/StaffMembers';
import { fetchCurrentUser } from './services/authService';
import ToastHost from './components/ui/ToastHost';
import ConfirmModal from './components/ui/ConfirmModal';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

/** Client-side “pages” only — no browser full reload when switching dashboard / coupons / staff. */
function App() {
  const [userRole, setUserRole] = useState(null); // 'admin' | 'superadmin'
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Restore session on initial load if we have a stored access token
  useEffect(() => {
    const restoreSession = async () => {
      const token = window.localStorage.getItem('accessToken');
      if (!token) {
        setSessionChecked(true);
        return;
      }

      try {
        const user = await fetchCurrentUser(token);
        const backendRole = user?.role;
        const mappedRole = backendRole === 'SUPER_ADMIN' ? 'superadmin' : 'admin';
        setCurrentUser(user || null);
        setUserRole(mappedRole);
        if (location.pathname === '/login' || location.pathname === '/') {
          navigate('/dashboard', { replace: true });
        }
      } catch {
        // Token is invalid/expired; clear it so we don't loop on errors
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('refreshToken');
        setCurrentUser(null);
        setUserRole(null);
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      } finally {
        setSessionChecked(true);
      }
    };

    restoreSession();
  }, [location.pathname, navigate]);

  const handleLoginSuccess = (role = 'admin', user = null) => {
    if (user) setCurrentUser(user);
    setUserRole(role);
    navigate('/dashboard', { replace: true });
  };

  const handleSectionNavigate = (sectionId) => {
    if (sectionId === 'dashboard') navigate('/dashboard');
    if (sectionId === 'restaurants') navigate('/restaurants');
    if (sectionId === 'coupons') navigate('/coupons');
    if (sectionId === 'staff') navigate('/staff');
  };

  const requestLogout = () => {
    if (logoutLoading) return;
    setLogoutConfirmOpen(true);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    // Add a small UX transition before session is cleared.
    await new Promise((resolve) => setTimeout(resolve, 2000));
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    setCurrentUser(null);
    setUserRole(null);
    setLogoutConfirmOpen(false);
    setLogoutLoading(false);
    navigate('/login', { replace: true });
  };

  if (!sessionChecked) {
    return (
      <div className="App min-h-screen bg-white">
        <ToastHost />
      </div>
    );
  };

  const isAuthed = Boolean(currentUser || window.localStorage.getItem('accessToken'));

  if (logoutLoading) {
    return (
      <div className="App min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
          <p className="text-[15px] text-[#55657A] font-medium">Logging you out...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-white">
      <ToastHost />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthed
              ? <Navigate to="/dashboard" replace />
              : <Login onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthed
              ? <Dashboard userRole={userRole} currentUser={currentUser} initialNav="dashboard" onNavigate={handleSectionNavigate} onLogout={requestLogout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/restaurants"
          element={
            isAuthed
              ? <Dashboard userRole={userRole} currentUser={currentUser} initialNav="restaurants" onNavigate={handleSectionNavigate} onLogout={requestLogout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/coupons"
          element={
            isAuthed
              ? <Coupons userRole={userRole} currentUser={currentUser} onNavigate={handleSectionNavigate} onLogout={requestLogout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/staff"
          element={
            isAuthed
              ? <StaffMembers userRole={userRole} currentUser={currentUser} onNavigate={handleSectionNavigate} onLogout={requestLogout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="/" element={<Navigate to={isAuthed ? '/dashboard' : '/login'} replace />} />
        <Route path="*" element={<Navigate to={isAuthed ? '/dashboard' : '/login'} replace />} />
      </Routes>
      <ConfirmModal
        isOpen={logoutConfirmOpen}
        title="Logout"
        message="Are you sure you want to logout from the web app?"
        confirmText="Logout"
        cancelText="Cancel"
        tone="danger"
        loading={logoutLoading}
        onCancel={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default App;
