import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import CouponCard from '../../components/dashboard/CouponCard';
import AddCouponModal from '../../components/dashboard/AddCouponModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { sidebarData, superadminSidebarData } from '../../constants/layoutData';
import { Plus, Ticket, Fuel, Utensils } from 'lucide-react';
import CustomSelect from '../../components/ui/CustomSelect';
import { useCouponMutations, useCouponsQuery, useOutletsQuery } from '../../query/useAppQueries';

const currencySymbolForOutletType = (outletType) => {
    const t = `${outletType || ''}`.toUpperCase();
    if (t === 'PETROL' || t.includes('PETROL') || t === 'GAS' || t.includes('GAS_STATION')) {
        return '₹';
    }
    return '$';
};

const mapCoupon = (c, outletType) => {
    let statusLabel = 'Approved';
    if (c.status === 'PENDING_APPROVAL') statusLabel = 'Pending';
    if (c.status === 'REJECTED') statusLabel = 'Rejected';

    const discountValue = parseFloat(c.discount_value || 0);
    let discountStr;
    if (c.coupon_type === 'PERCENTAGE') discountStr = `${discountValue}%`;
    else discountStr = `${currencySymbolForOutletType(outletType)}${discountValue}`;

    return {
        id: c.id,
        offer: c.title || 'SPECIAL OFFER',
        name: c.title || '',
        type: c.coupon_type || 'FLAT',
        discount: discountStr,
        discountValue: discountValue,
        detailsHeader: c.discount_mode === 'UPTO' ? 'Upto' : 'Flat',
        unit: 'off',
        status: statusLabel,
        rawStatus: c.status,
        minPurchase: c.min_purchase_amount || '',
        usageLimit: c.usage_limit_total || '',
        startDate: c.start_date ? new Date(c.start_date).toISOString().split('T')[0] : '',
        endDate: c.end_date ? new Date(c.end_date).toISOString().split('T')[0] : '',
        outlet_id: c.outlet_id,
    };
};

const toApiCouponType = (type) => {
    const normalized = `${type || ''}`.toUpperCase();
    return normalized === 'PERCENTAGE' || normalized === 'PERCENT' ? 'PERCENTAGE' : 'FLAT';
};

const Coupons = ({ onNavigate, userRole, currentUser }) => {
    const [activeTab, setActiveTab] = useState('active');
    const [activeNav, setActiveNav] = useState('coupons');
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [modalData, setModalData] = useState(null);
    const [currentLocationIndex, setCurrentLocationIndex] = useState(0);

    const [actionLoading, setActionLoading] = useState(false);
    const [, setError] = useState('');
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        tone: 'danger',
        onConfirm: null,
    });
    const outletsQuery = useOutletsQuery(userRole === 'superadmin' ? {} : { type: 'PETROL' });
    const outlets = useMemo(() => outletsQuery.data || [], [outletsQuery.data]);
    const selectedOutlet = outlets[currentLocationIndex] || null;
    const couponParams = useMemo(() => {
        if (userRole === 'superadmin' && selectedOutlet) {
            return { outlet_id: selectedOutlet.id };
        }
        return {};
    }, [userRole, selectedOutlet]);
    const couponsQuery = useCouponsQuery(couponParams);
    const coupons = useMemo(
        () => (couponsQuery.data || []).map((c) => mapCoupon(c, selectedOutlet?.type)),
        [couponsQuery.data, selectedOutlet?.type],
    );
    const loading = outletsQuery.isLoading || couponsQuery.isLoading;
    const couponMutations = useCouponMutations();

    useEffect(() => {
        if (!outlets.length) {
            setCurrentLocationIndex(0);
            return;
        }
        setCurrentLocationIndex((prev) => (prev >= 0 && prev < outlets.length ? prev : 0));
    }, [outlets]);

    useEffect(() => {
        if (outletsQuery.error) {
            setError(outletsQuery.error.message || 'Failed to load outlets');
        } else if (couponsQuery.error) {
            setError(couponsQuery.error.message || 'Failed to load coupons');
        }
    }, [outletsQuery.error, couponsQuery.error]);

    const handleNavChange = (navId) => {
        setActiveNav(navId);
        if (navId === 'dashboard') onNavigate?.('dashboard');
        if (navId === 'restaurants') onNavigate?.('restaurants');
        if (navId === 'staff') onNavigate?.('staff');
    };

    const tabs = [
        { id: 'active', label: 'Active Coupons', rawStatuses: ['APPROVED'] },
        { id: 'pending', label: 'Pending Coupons', rawStatuses: ['PENDING_APPROVAL'] },
        { id: 'rejected', label: 'Rejected Coupons', rawStatuses: ['REJECTED'] },
    ];

    const currentTab = tabs.find(t => t.id === activeTab);
    const filteredCoupons = coupons.filter(c => currentTab.rawStatuses.includes(c.rawStatus));

    const handleCardClick = (id) => setSelectedId(prev => prev === id ? null : id);

    const handleEdit = (id) => {
        const coupon = coupons.find(c => c.id === id);
        setModalData(coupon);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setModalData(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleCancel = () => setSelectedId(null);

    const closeConfirm = () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false, onConfirm: null }));
    };

    const openConfirm = ({ title, message, confirmText, tone = 'danger', onConfirm }) => {
        setConfirmState({
            isOpen: true,
            title,
            message,
            confirmText,
            tone,
            onConfirm,
        });
    };

    const handleDelete = (id) => {
        openConfirm({
            title: 'Delete Coupon',
            message: 'Are you sure you want to delete this coupon? This action cannot be undone.',
            confirmText: 'Delete',
            tone: 'danger',
            onConfirm: async () => {
                setActionLoading(true);
                setError('');
                try {
                    await couponMutations.deleteCoupon.mutateAsync(id);
                    setSelectedId(null);
                    closeConfirm();
                } catch (err) {
                    setError(err.message || 'Failed to delete coupon');
                } finally {
                    setActionLoading(false);
                }
            },
        });
    };

    // Safely parse a date string that may be DD/MM/YYYY or YYYY-MM-DD (from <input type="date">)
    const parseDateToISO = (str) => {
        if (!str) return undefined;
        // DD/MM/YYYY → YYYY-MM-DD
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
            const [d, m, y] = str.split('/');
            return new Date(`${y}-${m}-${d}`).toISOString();
        }
        const d = new Date(str);
        return isNaN(d.getTime()) ? undefined : d.toISOString();
    };

    const handleSaveCoupon = async (formData) => {
        setActionLoading(true);
        setError('');
        try {
            const currentOutlet = outlets[currentLocationIndex] || outlets[0];
            const editOutlet = modalMode === 'edit' && modalData?.outlet_id
                ? outlets.find((o) => o.id === modalData.outlet_id)
                : null;
            const targetOutlet = editOutlet || currentOutlet;
            if (!targetOutlet?.id) {
                setError('No outlet selected. Please create/select an outlet first.');
                setActionLoading(false);
                return;
            }
            const payload = {
                outlet_id: targetOutlet.id,
                title: formData.name,
                coupon_type: toApiCouponType(formData.type),
                discount_mode: formData.detailsHeader?.toUpperCase() === 'UPTO' ? 'UPTO' : 'FLAT',
                discount_value: parseFloat(formData.detailsValue) || 0,
                min_purchase_amount: formData.minPurchase ? parseFloat(formData.minPurchase) : undefined,
                usage_limit_total: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
                end_date: parseDateToISO(formData.endDate),
            };
            if (modalMode !== 'edit') {
                payload.start_date = parseDateToISO(formData.startDate);
            }
            if (modalMode === 'edit' && modalData?.id) {
                await couponMutations.updateCoupon.mutateAsync({ id: modalData.id, data: payload });
            } else {
                await couponMutations.createCoupon.mutateAsync(payload);
            }
            setIsModalOpen(false);
            setModalData(null);
            setModalMode('add');
        } catch (err) {
            setError(err.message || `Failed to ${modalMode === 'edit' ? 'update' : 'create'} coupon`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleApprove = async (id) => {
        openConfirm({
            title: 'Approve Coupon',
            message: 'Are you sure you want to approve this coupon?',
            confirmText: 'Approve',
            tone: 'danger',
            onConfirm: async () => {
                setActionLoading(true);
                setError('');
                try {
                    await couponMutations.approveCoupon.mutateAsync(id);
                    closeConfirm();
                } catch (err) {
                    setError(err.message || 'Failed to approve coupon');
                } finally {
                    setActionLoading(false);
                }
            },
        });
    };

    const handleReApprove = async (id) => {
        openConfirm({
            title: 'Re-Approve Coupon',
            message: 'Are you sure you want to re-approve this rejected coupon?',
            confirmText: 'Re-Approve',
            tone: 'danger',
            onConfirm: async () => {
                setActionLoading(true);
                setError('');
                try {
                    await couponMutations.approveCoupon.mutateAsync(id);
                    closeConfirm();
                } catch (err) {
                    setError(err.message || 'Failed to re-approve coupon');
                } finally {
                    setActionLoading(false);
                }
            },
        });
    };

    const handleReject = async (id) => {
        openConfirm({
            title: 'Reject Coupon',
            message: 'Are you sure you want to reject this coupon?',
            confirmText: 'Reject',
            tone: 'neutral',
            onConfirm: async () => {
                setActionLoading(true);
                setError('');
                try {
                    await couponMutations.rejectCoupon.mutateAsync({ id, reason: 'Rejected by super admin' });
                    closeConfirm();
                } catch (err) {
                    setError(err.message || 'Failed to reject coupon');
                } finally {
                    setActionLoading(false);
                }
            },
        });
    };

    const currentSidebarData = userRole === 'superadmin' ? superadminSidebarData : sidebarData;

    return (
        <DashboardLayout
            sidebarData={currentSidebarData}
            activeNav={activeNav}
            onNavChange={handleNavChange}
            role={userRole}
            currentUser={currentUser}
        >
            <div className="flex flex-col gap-8 pb-10">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex gap-4 flex-wrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setSelectedId(null); }}
                                className={`w-full sm:w-[200px] h-[48px] flex items-center justify-center gap-3 px-4 rounded-[16px] text-[15px] font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25 border border-primary'
                                    : 'bg-white text-[#999999] hover:text-dark shadow-sm border border-gray-100'}`}
                            >
                                <Ticket size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2}
                                    className={activeTab === tab.id ? 'text-white' : 'text-[#999999]'} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {userRole === 'superadmin' && (
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <CustomSelect
                                className="w-full sm:w-[260px]"
                                value={currentLocationIndex}
                                onChange={(nextValue) => {
                                    setCurrentLocationIndex(Number(nextValue));
                                    setSelectedId(null);
                                }}
                                options={
                                    outlets.length === 0
                                        ? [{ label: 'No outlets', value: '' }]
                                        : outlets.map((station, idx) => ({
                                            value: idx,
                                            label: station.type === 'RESTAURANT'
                                                ? `Restaurant - ${station.name || `Location 0${idx + 1}`}`
                                                : `Petrol - ${station.name || `Location 0${idx + 1}`}`,
                                        }))
                                }
                                icon={
                                    selectedOutlet?.type === 'RESTAURANT'
                                        ? <Utensils size={18} strokeWidth={2.3} className="text-primary" />
                                        : <Fuel size={18} strokeWidth={2.3} className="text-primary" />
                                }
                                placeholder="Select outlet"
                            />
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20 text-gray-400 text-sm">Loading coupons…</div>
                ) : (
                    <>
                        {filteredCoupons.length === 0 && (
                            <div className="text-gray-400 text-sm text-center">
                                No {currentTab.label.toLowerCase()} found.
                            </div>
                        )}

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
                                        onReject={() => handleReject(coupon.id)}
                                        onReApprove={() => handleReApprove(coupon.id)}
                                        scale={1.25}
                                    />
                                </div>
                            ))}

                            {activeTab === 'active' && (
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
                    </>
                )}
            </div>

            <AddCouponModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setModalData(null); setModalMode('add'); }}
                onCreate={handleSaveCoupon}
                mode={modalMode}
                initialData={modalData}
                loading={actionLoading}
            />

            <ConfirmModal
                isOpen={confirmState.isOpen}
                title={confirmState.title}
                message={confirmState.message}
                confirmText={confirmState.confirmText}
                tone={confirmState.tone}
                loading={actionLoading}
                onCancel={closeConfirm}
                onConfirm={() => confirmState.onConfirm?.()}
            />
        </DashboardLayout>
    );
};

export default Coupons;
