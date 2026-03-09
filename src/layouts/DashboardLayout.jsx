import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';

const DashboardLayout = ({
    children,
    sidebarData,
    activeNav,
    onNavChange,
    activeSubNav,
    onSubNavChange,
    title,
    role,
    onAddStation
}) => {
    return (
        <div className="flex h-screen bg-[#F3F7FA] overflow-hidden">
            <Sidebar
                data={sidebarData}
                activeNav={activeNav}
                onNavChange={onNavChange}
                activeSubNav={activeSubNav}
                onSubNavChange={onSubNavChange}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <TopBar title={title} role={role} onAddStation={onAddStation} />
                <main className="flex-1 p-4 md:p-5 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
