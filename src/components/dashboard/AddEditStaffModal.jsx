import React, { useState, useEffect } from 'react';
import { Users, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AddEditStaffModal = ({ isOpen, onClose, onSave, member = null }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        role: '',
        startTime: '',
        endTime: '',
    });

    useEffect(() => {
        if (member) {
            setFormData({
                name: member.name || '',
                phone: member.phone || '',
                role: member.role || '',
                startTime: member.shift?.split(' to ')[0] || '',
                endTime: member.shift?.split(' to ')[1] || '',
            });
        } else {
            setFormData({
                name: '',
                phone: '',
                role: '',
                startTime: '',
                endTime: '',
            });
        }
    }, [member, isOpen]);

    if (!isOpen) return null;

    const roles = ['Cashier', 'Manager', 'Attendant'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[8px]"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-[32px] w-full max-w-[440px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 font-onest">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-[12px] bg-[#FFF5F5] flex items-center justify-center">
                            <Users className="text-primary w-5 h-5" />
                        </div>
                        <h2 className="text-[20px] font-bold text-dark">
                            {member ? t('staff.modal.edit_title') : t('staff.modal.add_title')}
                        </h2>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-[#555555] ml-1">{t('staff.modal.name_label')}</label>
                            <input
                                type="text"
                                placeholder={t('staff.modal.name_placeholder')}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-5 py-4 bg-[#F8F9FA] border border-transparent rounded-[16px] text-[15px] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-[#555555] ml-1">{t('staff.modal.phone_label')}</label>
                            <input
                                type="text"
                                placeholder={t('staff.modal.phone_placeholder')}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-5 py-4 bg-[#F8F9FA] border border-transparent rounded-[16px] text-[15px] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-[#555555] ml-1">{t('staff.modal.role_label')}</label>
                            <div className="relative">
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-5 py-4 bg-[#F8F9FA] border border-transparent rounded-[16px] text-[15px] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all appearance-none text-dark"
                                >
                                    <option value="" disabled>{t('staff.modal.role_placeholder')}</option>
                                    {roles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L6 6L11 1" stroke="#939393" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-[13px] font-semibold text-[#555555] ml-1">{t('staff.modal.start_time')}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="9:00AM"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full px-5 py-4 bg-[#F8F9FA] border border-transparent rounded-[16px] text-[15px] focus:bg-white focus:border-primary/20 outline-none transition-all pr-12 font-medium"
                                    />
                                    <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-[13px] font-semibold text-[#555555] ml-1">{t('staff.modal.end_time')}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="5:00PM"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full px-5 py-4 bg-[#F8F9FA] border border-transparent rounded-[16px] text-[15px] focus:bg-white focus:border-primary/20 outline-none transition-all pr-12 font-medium"
                                    />
                                    <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-4 mt-10">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 bg-[#F3F3F3] text-[#555555] font-semibold rounded-[16px] hover:bg-gray-200 transition-all active:scale-[0.98]"
                        >
                            {t('staff.modal.cancel')}
                        </button>
                        <button
                            onClick={() => onSave(formData)}
                            className="flex-1 py-4 bg-primary text-white font-semibold rounded-[16px] hover:bg-primary/95 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            {member ? t('staff.modal.save') : t('staff.modal.add')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditStaffModal;
