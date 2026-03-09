// Refresh: Updated state management to use modal-based editing
import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import CouponCard from '../../components/dashboard/CouponCard';
import AddCouponModal from '../../components/dashboard/AddCouponModal';
import { sidebarData, superadminSidebarData, superadminStations, activeCoupons } from '../../data/dashboardData';
import { Plus, Ticket, ChevronDown } from 'lucide-react';

const Coupons = ({ onNavigate, userRole }) => {
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'pending' | 'rejected'
    const [activeNav, setActiveNav] = useState('coupons');
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [modalData, setModalData] = useState(null);
    const [currentLocationIndex, setCurrentLocationIndex] = useState(0);

    const handleNavChange = (navId) => {
        setActiveNav(navId);
        if (navId === 'dashboard' || navId === 'restaurants') onNavigate?.('dashboard');
        if (navId === 'staff') onNavigate?.('staff');
    };

    const tabs = [
        { id: 'active', label: 'Active Coupons', icon: <Ticket size={16} />, status: 'Approved' },
        { id: 'pending', label: 'Pending Coupons', icon: <Ticket size={16} />, status: 'Pending' },
        { id: 'rejected', label: 'Rejected Coupons', icon: <Ticket size={16} />, status: 'Rejected' },
    ];

    const currentTab = tabs.find(t => t.id === activeTab);
    const filteredCoupons = activeCoupons.filter(c => c.status === currentTab.status);

    const handleCardClick = (id) => {
        if (selectedId === id) {
            setSelectedId(null);
        } else {
            setSelectedId(id);
        }
    };

    const handleEdit = (id) => {
        const coupon = activeCoupons.find(c => c.id === id);
        setModalData(coupon);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setModalData(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setSelectedId(null);
    };

    const handleDelete = (id) => {
        console.log('Deleting coupon:', id);
        setSelectedId(null);
    };

    const handleCreateCoupon = (data) => {
        console.log('Handling coupon data:', data);
        setIsModalOpen(false);
    };

    const handleApprove = (id) => {
        if (window.confirm("Are you sure you want to approve this coupon?")) {
            console.log('Approving coupon', id);
            // Call API
        }
    };

    const handleReApprove = (id) => {
        if (window.confirm("Are you sure you want to re-approve this rejected coupon?")) {
            console.log('Re-approving coupon', id);
            // Call API
        }
    };

    const currentSidebarData = userRole === 'superadmin' ? superadminSidebarData : sidebarData;

    return (
        <DashboardLayout
            sidebarData={currentSidebarData}
            activeNav={activeNav}
            onNavChange={handleNavChange}
            title="Coupons"
            role={userRole}
        >
            <div className="flex flex-col gap-8 pb-10">

                {/* Tabs + Add Button / Location Dropdown row */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSelectedId(null);
                                }}
                                className={`flex items-center gap-3 px-6 py-3.5 rounded-[20px] text-[15px] font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25 border border-primary'
                                    : 'bg-white text-[#999999] hover:text-dark shadow-sm border border-gray-100'
                                    }`}
                            >
                                <Ticket
                                    size={20}
                                    strokeWidth={activeTab === tab.id ? 2.5 : 2}
                                    className={activeTab === tab.id ? 'text-white' : 'text-[#999999]'}
                                />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {userRole === 'superadmin' ? (
                        <div className="relative">
                            <select
                                className="appearance-none bg-white text-dark font-semibold text-[14px] pl-12 pr-10 py-3.5 rounded-[20px] shadow-sm border border-gray-100 outline-none cursor-pointer min-w-[180px]"
                                value={currentLocationIndex}
                                onChange={(e) => setCurrentLocationIndex(Number(e.target.value))}
                            >
                                {superadminStations.map((station, idx) => (
                                    <option key={station.id} value={idx}>
                                        Location 0{idx + 1}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                                <Ticket size={18} strokeWidth={2.5} />
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-dark">
                                <ChevronDown size={18} strokeWidth={2.5} />
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddClick}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-5 py-3 rounded-[12px] text-[13.5px] font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            <Plus size={18} strokeWidth={3} />
                            Add Coupon
                        </button>
                    )}
                </div>

                {/* Coupons Grid — 6 columns with exact 5px spacing and large cards */}
                <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-20 justify-items-center"
                    style={{ columnGap: '5px' }}
                >
                    {filteredCoupons.map((coupon) => (
                        <div key={coupon.id} className="flex justify-center w-full">
                            <CouponCard
                                coupon={coupon}
                                variant="detailed"
                                status={coupon.status}
                                isSelected={selectedId === coupon.id}
                                role={userRole}
                                onClick={handleCardClick}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onCancel={handleCancel}
                                onApprove={() => handleApprove(coupon.id)}
                                onReApprove={() => handleReApprove(coupon.id)}
                                scale={1.25}
                            />
                        </div>
                    ))}

                    {/* Add Coupon Placeholder Button (No border, large red icon) */}
                    {userRole !== 'superadmin' && (
                        <div className="flex items-center justify-center h-[262px] w-full" style={{ transform: 'scale(1.25)' }}>
                            <div
                                onClick={handleAddClick}
                                className="w-[38px] h-[38px] rounded-[14px] bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/40 hover:scale-110 hover:bg-primary/95 transition-all cursor-pointer active:scale-95"
                            >
                                <Plus size={18} strokeWidth={3.5} />
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <AddCouponModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateCoupon}
                mode={modalMode}
                initialData={modalData}
            />
        </DashboardLayout>
    );
};

export default Coupons;
