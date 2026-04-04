import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StationDetailCard from '../../components/dashboard/StationDetailCard';
import StatsChart from '../../components/dashboard/StatsChart';
import CouponCard from '../../components/dashboard/CouponCard';
import TransactionRow from '../../components/dashboard/TransactionRow';
import TransactionHistoryView from '../../components/dashboard/TransactionHistoryView';
import BillSidebar from '../../components/dashboard/BillSidebar';
import AddEditStationModal from '../../components/dashboard/AddEditStationModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { sidebarData, superadminSidebarData } from '../../constants/layoutData';
import {
    fetchOutlets,
    fetchOutletAnalytics,
    createOutlet,
    updateOutlet,
} from '../../services/dashboardService';
import { fetchCoupons } from '../../services/couponService';
import { fetchRedemptions } from '../../services/redemptionService';

const mapCoupon = (c) => {
    const discountValue = parseFloat(c.discount_value || 0);
    const discountStr = c.coupon_type === 'PERCENTAGE' ? `${discountValue}%` : `₹${discountValue}`;
    return { id: c.id, offer: c.title, type: c.coupon_type, discount: discountStr, unit: 'off', status: 'Approved' };
};

const mapTransaction = (t) => ({
    id: t.id,
    status: 'Approved',
    amount: `₹${t.bill_amount_before_discount || 0}`,
    discount: `-₹${t.discount_applied || 0}`,
    couponId: `C${t.coupon_id}`,
    date: t.redeemed_at ? new Date(t.redeemed_at).toLocaleDateString('en-GB') : '-',
    time: t.redeemed_at ? new Date(t.redeemed_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
});

const formatNumber = (value) => new Intl.NumberFormat('en-IN').format(Number(value || 0));

const RANGE_OPTIONS = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'last7', label: 'Last 7 Days' },
    { key: 'last30', label: 'Last 30 Days' },
    { key: 'thisMonth', label: 'This Month' },
];

const toYmd = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const buildRangeParams = (rangeKey) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (rangeKey === 'today') {
        const day = toYmd(today);
        return { from: day, to: day };
    }
    if (rangeKey === 'yesterday') {
        const y = new Date(today);
        y.setDate(y.getDate() - 1);
        const day = toYmd(y);
        return { from: day, to: day };
    }
    if (rangeKey === 'last30') {
        const from = new Date(today);
        from.setDate(from.getDate() - 29);
        return { from: toYmd(from), to: toYmd(today) };
    }
    if (rangeKey === 'thisMonth') {
        const from = new Date(today.getFullYear(), today.getMonth(), 1);
        return { from: toYmd(from), to: toYmd(today) };
    }
    // default: last 7 days
    const from = new Date(today);
    from.setDate(from.getDate() - 6);
    return { from: toYmd(from), to: toYmd(today) };
};

const Dashboard = ({ onNavigate, userRole, currentUser }) => {
    const [activeNav, setActiveNav] = useState('dashboard');
    const [view, setView] = useState('dashboard');
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [isAddStationOpen, setIsAddStationOpen] = useState(false);
    const [stationToEdit, setStationToEdit] = useState(null);
    const [confirmDeactivateOpen, setConfirmDeactivateOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [outlets, setOutlets] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [statsData, setStatsData] = useState([]);
    const [selectedRange, setSelectedRange] = useState('last7');
    const [activeCoupons, setActiveCoupons] = useState([]);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [, setError] = useState('');

    const isRestaurants = activeNav === 'restaurants';

    // Load outlets — optional selectOutletId keeps the user on the same outlet after save (no “full reset”).
    const loadOutlets = useCallback(async (opts = {}) => {
        const { resetIndex = false, selectOutletId = null } = opts;
        try {
            const params = isRestaurants ? { type: 'RESTAURANT' } : { type: 'PETROL' };
            const res = await fetchOutlets(params);
            const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
            const filtered = isRestaurants
                ? list.filter(o => o.type === 'RESTAURANT')
                : list.filter(o => o.type === 'PETROL');
            setOutlets(filtered);
            if (selectOutletId != null && selectOutletId !== '') {
                const idx = filtered.findIndex((o) => String(o.id) === String(selectOutletId));
                setCurrentIndex(idx >= 0 ? idx : 0);
            } else if (resetIndex) {
                setCurrentIndex(0);
            } else {
                setCurrentIndex((prev) => {
                    if (filtered.length === 0) return 0;
                    return Math.min(prev, filtered.length - 1);
                });
            }
        } catch (err) {
            setError(err.message || 'Failed to load outlets');
        }
    }, [isRestaurants]);

    useEffect(() => { loadOutlets({ resetIndex: true }); }, [loadOutlets]);

    // Load dashboard data for current outlet
    const loadDashboardData = useCallback(async () => {
        const outlet = outlets[currentIndex];
        if (!outlet) {
            setStatsData([
                { id: 'coupons', label: 'Coupons Active', value: '0', badge: { type: 'active', text: 'Active' } },
                { id: 'redemptions', label: 'Redemptions', value: '0', badge: { type: 'down', text: '0%' } },
                { id: 'discounts', label: 'Discounts', value: '0', badge: { type: 'up', text: '0%' } },
                { id: 'totalSales', label: 'Total Sale', value: '0', badge: { type: 'up', text: '0%' } },
            ]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            // Statistics must come from a single source: analytics API.
            const analyticsRes = await fetchOutletAnalytics(outlet.id, buildRangeParams(selectedRange)).catch(() => null);

            // Chart data
            if (analyticsRes?.daily_redemptions) {
                setChartData(analyticsRes.daily_redemptions.map(d => ({
                    month: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    redemptions: parseInt(d.redemptions_count || 0),
                    discounts: parseFloat(d.total_discount_given || 0),
                    totalSales: parseFloat(d.pre_discount_sales || 0),
                })));
            } else {
                setChartData([]);
            }

            const summary = analyticsRes?.summary || {};
            setStatsData([
                {
                    id: 'coupons',
                    label: 'Coupons Active',
                    value: formatNumber(summary.coupons_active),
                    badge: { type: 'active', text: 'Active' },
                },
                {
                    id: 'redemptions',
                    label: 'Redemptions',
                    value: formatNumber(summary.redemptions),
                    badge: { type: 'down', text: '6.8%' },
                },
                {
                    id: 'discounts',
                    label: 'Discounts',
                    value: formatNumber(summary.discounts),
                    badge: { type: 'up', text: '6.8%' },
                },
                {
                    id: 'totalSales',
                    label: 'Total Sale',
                    value: formatNumber(summary.total_sales),
                    badge: { type: 'up', text: '6.8%' },
                },
            ]);

            // Non-statistics sections load independently and do not affect analytics rendering.
            const couponsRes = await fetchCoupons({ outlet_id: outlet.id, status: 'APPROVED' }).catch(() => null);
            const rawCoupons = Array.isArray(couponsRes?.data) ? couponsRes.data : Array.isArray(couponsRes) ? couponsRes : [];
            setActiveCoupons(rawCoupons.map(mapCoupon));

            const txRes = await fetchRedemptions({ outlet_id: outlet.id }).catch(() => null);
            const rawTx = Array.isArray(txRes?.data) ? txRes.data : Array.isArray(txRes) ? txRes : [];
            setTransactionHistory(rawTx.map(mapTransaction));
        } catch (err) {
            setError(err.message || 'Failed to load dashboard data');
            setStatsData([
                { id: 'coupons', label: 'Coupons Active', value: '0', badge: { type: 'active', text: 'Active' } },
                { id: 'redemptions', label: 'Redemptions', value: '0', badge: { type: 'down', text: '0%' } },
                { id: 'discounts', label: 'Discounts', value: '0', badge: { type: 'up', text: '0%' } },
                { id: 'totalSales', label: 'Total Sale', value: '0', badge: { type: 'up', text: '0%' } },
            ]);
        } finally {
            setLoading(false);
        }
    }, [outlets, currentIndex, selectedRange]);

    useEffect(() => {
        if (outlets.length > 0) loadDashboardData();
        else setLoading(false);
    }, [outlets, currentIndex, loadDashboardData]);

    const handleNavChange = (navId) => {
        setActiveNav(navId);
        setView('dashboard');
        if (navId === 'coupons') onNavigate?.('coupons');
        if (navId === 'staff') onNavigate?.('staff');
    };

    const handleSaveStation = async (formData) => {
        setActionLoading(true);
        setError('');
        try {
            const payload = {
                name: formData.name,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                manager_name: formData.managerName,
                manager_phone: formData.managerPhone,
                latitude: formData.latitude,
                longitude: formData.longitude,
                type: isRestaurants ? 'RESTAURANT' : 'PETROL',
            };
            let focusId = stationToEdit?.outletId ?? stationToEdit?.id ?? null;
            if (stationToEdit) {
                await updateOutlet(stationToEdit.outletId || stationToEdit.id, payload);
            } else {
                const created = await createOutlet(payload);
                focusId = created?.id ?? focusId;
            }
            setIsAddStationOpen(false);
            setStationToEdit(null);
            await loadOutlets({ selectOutletId: focusId });
        } catch (err) {
            setError(err.message || 'Failed to save outlet');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeactivateStation = async () => {
        const outletId = currentEntityObj?.id;
        if (!outletId) return;
        setActionLoading(true);
        setError('');
        try {
            await updateOutlet(outletId, { status: 'DEACTIVATED' });
            setConfirmDeactivateOpen(false);
            await loadOutlets({ resetIndex: false });
        } catch (err) {
            setError(err.message || 'Failed to deactivate outlet');
        } finally {
            setActionLoading(false);
        }
    };

    const currentEntityObj = outlets[currentIndex] || {};
    const currentSidebarData = userRole === 'superadmin'
        ? {
            ...superadminSidebarData,
            navItems: superadminSidebarData.navItems.map((item) => {
                if (item.id === activeNav && (item.id === 'dashboard' || item.id === 'restaurants')) {
                    return {
                        ...item,
                        subItems: outlets.map((outlet, idx) => ({
                            id: idx,
                            label: outlet.name || `${item.id === 'dashboard' ? 'Station' : 'Restaurant'} ${idx + 1}`,
                        })),
                    };
                }
                return item;
            }),
        }
        : sidebarData;

    const stationDetailData = {
        name: currentEntityObj.name || 'Unknown Outlet',
        icon: isRestaurants ? 'utensils' : 'fuel',
        address: currentEntityObj.address || 'No address',
        status: currentEntityObj.status || 'ACTIVE',
        outletId: currentEntityObj.id,
        manager: currentEntityObj.manager_name || 'N/A',
        contact: currentEntityObj.manager_phone || 'N/A',
        latitude: currentEntityObj.latitude,
        longitude: currentEntityObj.longitude,
    };

    return (
        <>
            <DashboardLayout
                sidebarData={currentSidebarData}
                activeNav={activeNav}
                onNavChange={handleNavChange}
                activeSubNav={currentIndex}
                onSubNavChange={setCurrentIndex}
                title={view === 'transactions' ? 'Transaction History' : ''}
                role={userRole}
                currentUser={currentUser}
                onAddStation={() => { setStationToEdit(null); setIsAddStationOpen(true); }}
            >
                <div className="flex gap-6 h-full">
                    <div className="flex-1 flex flex-col gap-4 min-w-0">
                        {view === 'dashboard' ? (
                            <>
                                {userRole === 'superadmin' && (
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                                disabled={currentIndex <= 0}
                                                className={`w-12 h-12 flex items-center justify-center rounded-[16px] transition-all focus:outline-none ${currentIndex > 0 ? 'bg-white text-[#939393] hover:bg-gray-50' : 'bg-[#F4F4F4]/50 text-[#C4C4C4]'}`}
                                            >
                                                <ChevronLeft size={24} strokeWidth={3} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentIndex(prev => Math.min(outlets.length - 1, prev + 1))}
                                                disabled={currentIndex >= outlets.length - 1}
                                                className={`w-12 h-12 flex items-center justify-center rounded-[16px] transition-all focus:outline-none ${currentIndex < outlets.length - 1 ? 'bg-white text-[#939393] hover:bg-gray-50' : 'bg-[#F4F4F4]/50 text-[#C4C4C4]'}`}
                                            >
                                                <ChevronRight size={24} strokeWidth={3} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => { setStationToEdit(null); setIsAddStationOpen(true); }}
                                            className="bg-[#DC0004] text-white px-6 py-3.5 rounded-[12px] text-[14px] font-bold shadow-sm hover:opacity-95 transition-all flex items-center gap-2"
                                        >
                                            <span className="text-[18px] leading-none">+</span>
                                            {isRestaurants ? 'Add Restaurant' : 'Add Petrol Station'}
                                        </button>
                                    </div>
                                )}

                                {loading ? (
                                    <div className="flex bg-white h-40 rounded-xl justify-center items-center text-gray-400 text-sm">
                                        Loading dashboard data…
                                    </div>
                                ) : outlets.length === 0 ? (
                                    <div className="flex bg-white h-40 rounded-xl justify-center items-center text-gray-400 text-sm">
                                        No outlets found.
                                    </div>
                                ) : (
                                    <>
                                        <StationDetailCard
                                            data={stationDetailData}
                                            role={userRole}
                                            entityType={isRestaurants ? 'restaurant' : 'station'}
                                            onEdit={() => {
                                                setStationToEdit(currentEntityObj);
                                                setIsAddStationOpen(true);
                                            }}
                                            onDeactivate={() => setConfirmDeactivateOpen(true)}
                                        />

                                        <StatsChart
                                            data={chartData}
                                            statsData={statsData}
                                            selectedRangeLabel={RANGE_OPTIONS.find((o) => o.key === selectedRange)?.label || 'Last 7 Days'}
                                            rangeOptions={RANGE_OPTIONS}
                                            onRangeChange={setSelectedRange}
                                        />

                                        <div className="bg-white rounded-[16px] px-6 py-5">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-8 h-8 rounded-full bg-[#F3F7FA] flex items-center justify-center">
                                                    <img src="/images/activecoupns.png" alt="coupons" className="w-[18px] h-[18px]" />
                                                </div>
                                                <span className="text-[14px] font-semibold text-dark">Active Coupons</span>
                                            </div>
                                            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                                                {activeCoupons.length > 0
                                                    ? activeCoupons.map(c => <CouponCard key={c.id} coupon={c} />)
                                                    : <div className="text-gray-400 text-sm py-4">No active coupons.</div>}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[16px] px-6 py-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-[#F3F7FA] flex items-center justify-center">
                                                        <img src="/images/transactionhis.png" alt="transactions" className="w-[18px] h-[18px]" />
                                                    </div>
                                                    <span className="text-[14px] font-semibold text-dark">Transaction History</span>
                                                </div>
                                                <button
                                                    onClick={() => setView('transactions')}
                                                    className="text-[12px] text-dark font-medium hover:text-primary transition-colors"
                                                >
                                                    View full Transaction
                                                </button>
                                            </div>
                                            {transactionHistory.length > 0
                                                ? transactionHistory.slice(0, 3).map(tx => (
                                                    <TransactionRow key={tx.id} transaction={tx} />
                                                ))
                                                : <div className="text-gray-400 text-sm">No recent transactions.</div>}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <TransactionHistoryView
                                transactions={transactionHistory}
                                selectedId={selectedTransactionId}
                                onViewBill={(id) => setSelectedTransactionId(prev => prev === id ? null : id)}
                            />
                        )}
                    </div>

                    {view === 'transactions' && selectedTransactionId && (
                        <BillSidebar
                            transaction={transactionHistory.find(t => t.id === selectedTransactionId)}
                            onClose={() => setSelectedTransactionId(null)}
                        />
                    )}
                </div>
            </DashboardLayout>

            <AddEditStationModal
                isOpen={isAddStationOpen}
                onClose={() => { setIsAddStationOpen(false); setStationToEdit(null); }}
                onSave={handleSaveStation}
                station={stationToEdit}
                entityType={isRestaurants ? 'restaurant' : 'station'}
                loading={actionLoading}
            />

            <ConfirmModal
                isOpen={confirmDeactivateOpen}
                title={isRestaurants ? 'Deactivate Restaurant' : 'Deactivate Station'}
                message={`Are you sure you want to deactivate this ${isRestaurants ? 'restaurant' : 'station'}?`}
                confirmText="Deactivate"
                tone="danger"
                loading={actionLoading}
                onCancel={() => setConfirmDeactivateOpen(false)}
                onConfirm={handleDeactivateStation}
            />
        </>
    );
};

export default Dashboard;
