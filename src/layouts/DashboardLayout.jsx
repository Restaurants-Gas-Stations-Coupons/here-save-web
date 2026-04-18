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
    currentUser,
    onAddStation,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    showSearch = true,
    onLogout,
}) => {
    const activeNavLabel = Array.isArray(sidebarData?.navItems)
        ? sidebarData.navItems.find((item) => item.id === activeNav)?.label
        : '';
    const resolvedTitle = title || activeNavLabel || '';

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
                <TopBar
                    title={resolvedTitle}
                    role={role}
                    currentUser={currentUser}
                    onAddStation={onAddStation}
                    navItems={sidebarData?.navItems || []}
                    activeNav={activeNav}
                    onNavChange={onNavChange}
                    searchValue={searchValue}
                    onSearchChange={onSearchChange}
                    searchPlaceholder={searchPlaceholder}
                    showSearch={showSearch}
                    onLogout={onLogout}
                />
                <main className="flex-1 p-4 md:p-5 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
