import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StationDetailCard from '../../components/dashboard/StationDetailCard';
import StatsChart from '../../components/dashboard/StatsChart';
import CouponCard from '../../components/dashboard/CouponCard';
import TransactionRow from '../../components/dashboard/TransactionRow';

// Replace imports below with API service calls when backend is ready:
// e.g. import { fetchDashboard } from '../../services/dashboardService';
import {
    stationData,
    sidebarData,
    superadminSidebarData,
    superadminStations,
    superadminRestaurants,
    statsData,
    chartData,
    activeCoupons,
    transactionHistory,
} from '../../data/dashboardData';

import TransactionHistoryView from '../../components/dashboard/TransactionHistoryView';
import BillSidebar from '../../components/dashboard/BillSidebar';
import AddEditStationModal from '../../components/dashboard/AddEditStationModal';

const Dashboard = ({ onNavigate, userRole }) => {
    const [activeNav, setActiveNav] = useState('dashboard');
    const [view, setView] = useState('dashboard'); // 'dashboard' | 'transactions'
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [isAddStationOpen, setIsAddStationOpen] = useState(false);
    const [stationToEdit, setStationToEdit] = useState(null);
    const [currentStationIndex, setCurrentStationIndex] = useState(0);
    const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState(0);

    const handleNavChange = (navId) => {
        setActiveNav(navId);
        if (navId === 'dashboard' || navId === 'restaurants') setView('dashboard');
        if (navId === 'coupons') onNavigate?.('coupons');
        if (navId === 'staff') onNavigate?.('staff');
    };

    const handleRedeem = (couponId) => {
        console.log('Redeeming coupon:', couponId);
        // call API here when integrated
    };

    const handleViewTransactions = () => {
        setView('transactions');
    };

    const handleViewBill = (id) => {
        setSelectedTransactionId(prev => prev === id ? null : id);
    };

    const handleAddStation = (data) => {
        console.log('Saving entity:', data);
        setIsAddStationOpen(false);
        setStationToEdit(null);
        // call API here when integrated
    };

    const selectedTx = transactionHistory.find(t => t.id === selectedTransactionId);

    // Determine correct sub-index and data array based on active nav
    const isRestaurants = activeNav === 'restaurants';
    const currentIndex = isRestaurants ? currentRestaurantIndex : currentStationIndex;
    const superadminDataArray = isRestaurants ? superadminRestaurants : superadminStations;

    // Set dynamic TopBar Title
    let dashboardTitle = 'Dashboard';
    if (userRole === 'superadmin') {
        if (isRestaurants) {
            dashboardTitle = `Restaurants < Location 0${currentIndex + 1}`;
        } else {
            dashboardTitle = `Petrol Pumps < Location 0${currentIndex + 1}`;
        }
    }

    const currentSidebarData = userRole === 'superadmin' ? superadminSidebarData : sidebarData;

    // Get actual data based on role
    const currentEntityObj = userRole === 'superadmin' ? superadminDataArray[currentIndex].stationData : stationData;
    const currentStatsObj = userRole === 'superadmin' ? superadminDataArray[currentIndex].statsData : statsData;

    const handleSubNavChange = (id) => {
        if (isRestaurants) setCurrentRestaurantIndex(id);
        else setCurrentStationIndex(id);
    };

    const handlePrev = () => {
        if (isRestaurants) {
            setCurrentRestaurantIndex(prev => Math.max(0, prev - 1));
        } else {
            setCurrentStationIndex(prev => Math.max(0, prev - 1));
        }
    };

    const handleNext = () => {
        if (isRestaurants) {
            setCurrentRestaurantIndex(prev => Math.min(superadminRestaurants.length - 1, prev + 1));
        } else {
            setCurrentStationIndex(prev => Math.min(superadminStations.length - 1, prev + 1));
        }
    };

    return (
        <>
            <DashboardLayout
                sidebarData={currentSidebarData}
                activeNav={activeNav}
                onNavChange={handleNavChange}
                activeSubNav={currentIndex}
                onSubNavChange={handleSubNavChange}
                title={view === 'transactions' ? 'Dashboard' : dashboardTitle}
                role={userRole}
                onAddStation={() => {
                    setStationToEdit(null);
                    setIsAddStationOpen(true);
                }}
            >
                <div className="flex gap-6 h-full">
                    <div className="flex-1 flex flex-col gap-4 min-w-0">
                        {view === 'dashboard' ? (
                            <>
                                {/* Superadmin Top Actions Row */}
                                {userRole === 'superadmin' && (
                                    <div className="flex items-center justify-between mb-2">
                                        {/* Pagination Controls */}
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={handlePrev}
                                                disabled={currentIndex === 0}
                                                className={`w-12 h-12 flex items-center justify-center rounded-[16px] transition-all focus:outline-none ${currentIndex > 0 ? 'bg-white text-[#939393] hover:bg-gray-50 hover:text-dark shadow-sm' : 'bg-[#F4F4F4]/50 text-[#C4C4C4]'}`}
                                            >
                                                <ChevronLeft size={24} strokeWidth={3} />
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                disabled={currentIndex === superadminDataArray.length - 1}
                                                className={`w-12 h-12 flex items-center justify-center rounded-[16px] transition-all focus:outline-none ${currentIndex < superadminDataArray.length - 1 ? 'bg-white text-[#939393] hover:bg-gray-50 hover:text-dark shadow-sm' : 'bg-[#F4F4F4]/50 text-[#C4C4C4]'}`}
                                            >
                                                <ChevronRight size={24} strokeWidth={3} />
                                            </button>
                                        </div>

                                        {/* Add Button */}
                                        <button
                                            onClick={() => {
                                                setStationToEdit(null);
                                                setIsAddStationOpen(true);
                                            }}
                                            className="bg-[#DC0004] text-white px-6 py-3.5 rounded-[12px] text-[14px] font-bold shadow-sm hover:opacity-95 transition-all flex items-center gap-2"
                                        >
                                            <span className="text-[18px] leading-none">+</span>
                                            {isRestaurants ? 'Add Restaurant' : 'Add Petrol Station'}
                                        </button>
                                    </div>
                                )}

                                {/* Station/Restaurant Details */}
                                <StationDetailCard
                                    data={currentEntityObj}
                                    role={userRole}
                                    entityType={isRestaurants ? 'restaurant' : 'station'}
                                    onEdit={() => {
                                        setStationToEdit(currentEntityObj);
                                        setIsAddStationOpen(true);
                                    }}
                                />


                                {/* Statistics + Chart */}
                                <StatsChart data={chartData} statsData={currentStatsObj} />

                                {/* Active Coupons */}
                                <div className="bg-white rounded-[16px] px-6 py-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-[#F3F7FA] flex items-center justify-center">
                                            <img src="/images/activecoupns.png" alt="coupons" className="w-[18px] h-[18px]" />
                                        </div>
                                        <span className="text-[14px] font-semibold text-dark">Active Coupons</span>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                                        {activeCoupons.map((coupon) => (
                                            <CouponCard key={coupon.id} coupon={coupon} onRedeem={handleRedeem} />
                                        ))}
                                    </div>
                                </div>

                                {/* Transaction History Preview */}
                                <div className="bg-white rounded-[16px] px-6 py-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-[#F3F7FA] flex items-center justify-center">
                                                <img src="/images/transactionhis.png" alt="transactions" className="w-[18px] h-[18px]" />
                                            </div>
                                            <span className="text-[14px] font-semibold text-dark">Transaction History</span>
                                        </div>
                                        <button
                                            onClick={handleViewTransactions}
                                            className="text-[12px] text-dark font-medium hover:text-primary transition-colors"
                                        >
                                            View full Transaction
                                        </button>
                                    </div>
                                    <div>
                                        {transactionHistory.slice(0, 3).map((tx) => (
                                            <TransactionRow key={tx.id} transaction={tx} />
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <TransactionHistoryView
                                transactions={transactionHistory}
                                selectedId={selectedTransactionId}
                                onViewBill={handleViewBill}
                            />
                        )}
                    </div>

                    {view === 'transactions' && selectedTransactionId && (
                        <BillSidebar
                            transaction={selectedTx}
                            onClose={() => setSelectedTransactionId(null)}
                        />
                    )}
                </div>
            </DashboardLayout>

            <AddEditStationModal
                isOpen={isAddStationOpen}
                onClose={() => {
                    setIsAddStationOpen(false);
                    setStationToEdit(null);
                }}
                onSave={handleAddStation}
                station={stationToEdit}
                entityType={isRestaurants ? 'restaurant' : 'station'}
            />
        </>
    );
};

export default Dashboard;
