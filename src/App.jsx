import React, { useState } from 'react';
import './i18n'; // Import i18n configuration
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Coupons from './pages/Coupons';
import StaffMembers from './pages/StaffMembers';

function App() {
  const [page, setPage] = useState('login');
  const [userRole, setUserRole] = useState(null); // 'admin' | 'superadmin'

  const handleLoginSuccess = (role = 'admin') => {
    setUserRole(role);
    setPage('dashboard');
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard userRole={userRole} onNavigate={(p) => setPage(p)} />;
      case 'coupons':
        return <Coupons userRole={userRole} onNavigate={(p) => setPage(p)} />;
      case 'staff':
        return <StaffMembers userRole={userRole} onNavigate={(p) => setPage(p)} />;
      default:
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="App min-h-screen bg-white">
      {renderPage()}
    </div>
  );
}

export default App;
