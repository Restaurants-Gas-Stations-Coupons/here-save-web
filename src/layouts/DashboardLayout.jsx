import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';

const DashboardLayout = ({ children, sidebarData, activeNav, onNavChange, title = "Dashboard" }) => {
    return (
        <div className="flex min-h-screen bg-[#F3F7FA] font-onest">
            <Sidebar
                data={sidebarData}
                activeNav={activeNav}
                onNavChange={onNavChange}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <TopBar title={title} />
                <main className="flex-1 p-4 md:p-5 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
