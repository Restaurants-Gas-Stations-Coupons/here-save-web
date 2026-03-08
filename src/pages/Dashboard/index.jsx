import React, { useState } from 'react';
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
    statsData,
    chartData,
    activeCoupons,
    transactionHistory,
} from '../../data/dashboardData';

import TransactionHistoryView from '../../components/dashboard/TransactionHistoryView';
import BillSidebar from '../../components/dashboard/BillSidebar';

const Dashboard = ({ onNavigate }) => {
    const [activeNav, setActiveNav] = useState('dashboard');
    const [view, setView] = useState('dashboard'); // 'dashboard' | 'transactions'
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

    const handleNavChange = (navId) => {
        setActiveNav(navId);
        if (navId === 'dashboard') setView('dashboard');
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

    const selectedTx = transactionHistory.find(t => t.id === selectedTransactionId);

    return (
        <DashboardLayout
            sidebarData={sidebarData}
            activeNav={activeNav}
            onNavChange={handleNavChange}
            title={view === 'transactions' ? 'Dashboard' : 'Dashboard'}
        >
            <div className="flex gap-6 h-full">
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                    {view === 'dashboard' ? (
                        <>
                            {/* Station Details */}
                            <StationDetailCard data={stationData} />

                            {/* Statistics + Chart */}
                            <StatsChart data={chartData} statsData={statsData} />

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
    );
};

export default Dashboard;
