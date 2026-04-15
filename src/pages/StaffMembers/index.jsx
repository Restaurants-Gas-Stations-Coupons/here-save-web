import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { sidebarData, superadminSidebarData } from '../../constants/layoutData';
import { Pencil, Trash2, Check, Plus, ChevronLeft, ChevronRight, Fuel, Utensils } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StaffTableRow from '../../components/dashboard/StaffTableRow';
import AddEditStaffModal from '../../components/dashboard/AddEditStaffModal';
import CustomSelect from '../../components/ui/CustomSelect';
import { useCreateEmployeeMutation, useEmployeesQuery, useOutletsQuery } from '../../query/useAppQueries';

const mapEmployee = (emp) => {
    const user = emp.User || emp;
    return {
        id: emp.id,
        name: user.full_name || user.name || 'Unknown',
        phone: user.phone || 'N/A',
        email: user.email || 'N/A',
        role: user.role || 'EMPLOYEE',
        shift: `${emp.shift_start || '09:00'} to ${emp.shift_end || '17:00'}`,
        permission: emp.status === 'ACTIVE' ? 'Accepted' : 'Pending',
        image: user.profile_picture || null,
        user_id: emp.user_id,
        outlet_id: emp.outlet_id,
    };
};

const StaffMembers = ({ onNavigate, userRole, currentUser }) => {
    const { t } = useTranslation();
    const [selectedIds, setSelectedIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const [selectedOutletId, setSelectedOutletId] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [, setError] = useState('');
    const outletsQuery = useOutletsQuery(userRole === 'superadmin' ? {} : { type: 'PETROL' });
    const outlets = useMemo(() => outletsQuery.data || [], [outletsQuery.data]);
    const staffQuery = useEmployeesQuery(selectedOutletId);
    const createEmployeeMutation = useCreateEmployeeMutation();
    const staff = useMemo(
        () => ((staffQuery.data || []).map(mapEmployee)),
        [staffQuery.data],
    );
    const loading = outletsQuery.isLoading || (Boolean(selectedOutletId) && staffQuery.isLoading);
    const currentSidebarData = userRole === 'superadmin' ? superadminSidebarData : sidebarData;
    const selectedOutlet = outlets.find((o) => o.id === selectedOutletId) || null;

    useEffect(() => {
        if (selectedOutletId) return;
        if (!outlets.length) return;
        setSelectedOutletId(outlets[0].id);
    }, [outlets, selectedOutletId]);

    useEffect(() => {
        if (outletsQuery.error) {
            setError(outletsQuery.error.message || 'Failed to load outlets');
        }
    }, [outletsQuery.error]);

    useEffect(() => {
        if (staffQuery.error) {
            setError(staffQuery.error.message || 'Failed to load staff');
        }
    }, [staffQuery.error]);

    const handleNavChange = (navId) => {
        if (navId === 'dashboard' || navId === 'restaurants') onNavigate?.('dashboard');
        if (navId === 'coupons') onNavigate?.('coupons');
    };

    const toggleSelect = (id) =>
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const toggleSelectAll = () => {
        const current = currentStaff;
        if (selectedIds.length === current.length) setSelectedIds([]);
        else setSelectedIds(current.map(m => m.id));
    };

    const handleAddClick = () => { setEditingMember(null); setIsModalOpen(true); };

    const handleEditClick = () => {
        const member = staff.find(m => m.id === selectedIds[0]);
        setEditingMember(member);
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        setError('');
        try {
            if (editingMember) {
                // No update employee route in backend yet, log for now
                console.log('Edit employee (no backend PATCH route yet):', formData);
            } else {
                await createEmployeeMutation.mutateAsync({
                    full_name: formData.name?.trim(),
                    email: formData.email?.trim() || undefined,
                    phone: formData.phone?.replace(/\s|-/g, '').trim(),
                    outlet_id: selectedOutletId,
                    shift_start: formData.startTime ? `${formData.startTime}:00` : undefined,
                    shift_end: formData.endTime ? `${formData.endTime}:00` : undefined,
                    status: 'ACTIVE',
                });
            }
            setIsModalOpen(false);
        } catch (err) {
            setError(err.message || 'Failed to save staff member');
        } finally {
            setActionLoading(false);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStaff = staff.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(staff.length / (itemsPerPage || 1));
    const allSelected = selectedIds.length === currentStaff.length && currentStaff.length > 0;

    return (
        <DashboardLayout
            sidebarData={currentSidebarData}
            activeNav="staff"
            onNavChange={handleNavChange}
            role={userRole}
            currentUser={currentUser}
        >
            <div className="flex flex-col gap-4 h-full font-onest">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-gray-100 rounded-[14px] text-[14px] font-semibold text-dark hover:bg-gray-50 transition-all shadow-sm">
                            <img src="/images/filter.svg" alt="filter" className="w-[18px] h-[18px]" />
                            {t('staff.filter')}
                        </button>
                        {userRole === 'superadmin' && outlets.length > 0 && (
                            <CustomSelect
                                className="w-full sm:w-[260px]"
                                buttonClassName="bg-white border-[3px] border-[#2A90E8] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.1)]"
                                menuClassName="shadow-[0px_1px_10px_0px_rgba(0,0,0,0.1)]"
                                value={selectedOutletId || ''}
                                onChange={(nextValue) => {
                                    const outletId = Number(nextValue);
                                    setSelectedOutletId(outletId);
                                    setCurrentPage(1);
                                    setSelectedIds([]);
                                }}
                                options={outlets.map((o) => ({
                                    value: o.id,
                                    label: o.type === 'RESTAURANT' ? `Restaurant - ${o.name}` : `Petrol - ${o.name}`,
                                }))}
                                icon={
                                    selectedOutlet?.type === 'RESTAURANT'
                                        ? <Utensils size={18} strokeWidth={2.3} className="text-primary" />
                                        : <Fuel size={18} strokeWidth={2.3} className="text-primary" />
                                }
                                placeholder="Select outlet"
                            />
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {selectedIds.length === 1 && (
                            <button
                                onClick={handleEditClick}
                                className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-gray-100 rounded-[14px] text-[14px] font-semibold text-dark hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <Pencil className="w-[18px] h-[18px] text-[#555555]" />
                                {t('staff.edit')}
                            </button>
                        )}
                        {selectedIds.length > 0 && (
                            <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-gray-100 rounded-[14px] text-[14px] font-semibold text-primary hover:bg-red-50 transition-all shadow-sm">
                                <Trash2 className="w-[18px] h-[18px] text-primary" />
                                {t('staff.delete')}
                            </button>
                        )}
                        <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-gray-100 rounded-[14px] text-[14px] font-semibold text-dark hover:bg-gray-50 transition-all shadow-sm">
                            <img src="/images/export.svg" alt="export" className="w-[18px] h-[18px]" />
                            {t('staff.export')}
                        </button>
                        <button
                            onClick={handleAddClick}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-[14px] text-[14px] font-semibold text-white hover:bg-primary/95 transition-all shadow-md active:scale-[0.98]"
                        >
                            <Plus className="w-[18px] h-[18px]" strokeWidth={3} />
                            {t('staff.add_new')}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
                    <div className="overflow-x-auto no-scrollbar min-h-[400px]">
                        {loading ? (
                            <div className="flex justify-center items-center h-48 text-gray-400 text-sm">Loading staff members…</div>
                        ) : staff.length === 0 ? (
                            <div className="flex justify-center items-center h-48 text-gray-400 text-sm">No staff members found for the selected outlet.</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#DC000408]">
                                        <th className="py-4 pl-5 pr-3 w-[50px]">
                                            <div
                                                onClick={toggleSelectAll}
                                                className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center cursor-pointer transition-all bg-white ${allSelected ? 'bg-primary border-primary' : 'border-gray-300'}`}
                                            >
                                                {allSelected && <Check className="text-white w-3 h-3" strokeWidth={5} />}
                                            </div>
                                        </th>
                                        <th className="py-4 px-3 text-[13px] font-bold text-[#555555] tracking-tight">{t('staff.table.image')}</th>
                                        <th className="py-4 px-3 text-[13px] font-bold text-[#555555] tracking-tight">Full Name</th>
                                        <th className="py-4 px-3 text-[13px] font-bold text-[#555555] tracking-tight">Phone</th>
                                        <th className="py-4 px-3 text-[13px] font-bold text-[#555555] tracking-tight">Email</th>
                                        <th className="py-4 px-3 text-[13px] font-bold text-[#555555] tracking-tight">Role</th>
                                        <th className="py-4 px-3 text-[13px] font-bold text-[#555555] tracking-tight">Shift Time</th>
                                        <th className="py-4 px-3 text-[13px] font-bold text-[#555555] tracking-tight pr-5">Permission</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentStaff.map((member) => (
                                        <StaffTableRow
                                            key={member.id}
                                            member={member}
                                            isSelected={selectedIds.includes(member.id)}
                                            onToggle={toggleSelect}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center py-6 border-t border-gray-50 gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 rounded-lg text-[13px] font-semibold transition-all ${currentPage === i + 1 ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <AddEditStaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                member={editingMember}
                loading={actionLoading}
            />
        </DashboardLayout>
    );
};

export default StaffMembers;
