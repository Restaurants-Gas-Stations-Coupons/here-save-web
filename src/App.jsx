import React, { useState } from 'react';
import './i18n'; // Import i18n configuration
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Coupons from './pages/Coupons';
import StaffMembers from './pages/StaffMembers';

function App() {
  const [page, setPage] = useState('login');

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard onNavigate={(p) => setPage(p)} />;
      case 'coupons':
        return <Coupons onNavigate={(p) => setPage(p)} />;
      case 'staff':
        return <StaffMembers onNavigate={(p) => setPage(p)} />;
      default:
        return <Login onLoginSuccess={() => setPage('dashboard')} />;
    }
  };

  return (
    <div className="App min-h-screen bg-white">
      {renderPage()}
    </div>
  );
}

export default App;
