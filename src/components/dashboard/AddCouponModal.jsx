import React, { useState, useEffect } from 'react';
import { X, Calendar, Ticket, ChevronDown } from 'lucide-react';

const AddCouponModal = ({ isOpen, onClose, onCreate, initialData, mode = 'add' }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Amount', // 'Amount' | 'Percentage'
        detailsHeader: 'Upto', // 'Upto' | 'Flat'
        detailsValue: '',
        minPurchase: '',
        usageLimit: '',
        startDate: '26/02/2026',
        endDate: ''
    });

    useEffect(() => {
        if (initialData && mode === 'edit') {
            setFormData({
                name: initialData.name || '',
                type: initialData.type || 'Amount',
                detailsHeader: initialData.detailsHeader || 'Upto',
                detailsValue: initialData.discount || '',
                minPurchase: initialData.minPurchase || '',
                usageLimit: initialData.usageLimit || '',
                startDate: initialData.startDate || '26/02/2026',
                endDate: initialData.endDate || ''
            });
        } else if (mode === 'add') {
            setFormData({
                name: '',
                type: 'Amount',
                detailsHeader: 'Upto',
                detailsValue: '',
                minPurchase: '',
                usageLimit: '',
                startDate: '26/02/2026',
                endDate: ''
            });
        }
    }, [initialData, mode, isOpen]);

    if (!isOpen) return null;

    const handleToggleType = (type) => setFormData(prev => ({ ...prev, type }));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[12px]"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-[440px] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-[#FFF5F5] flex items-center justify-center">
                            <Ticket className="text-primary" size={20} />
                        </div>
                        <h2 className="text-[20px] font-bold text-dark">
                            {mode === 'edit' ? 'Edit Coupon' : 'Add Coupon'}
                        </h2>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                        {/* Coupon Name */}
                        <div>
                            <label className="block text-[13px] font-bold text-dark/80 mb-2">Coupon Name</label>
                            <input
                                type="text"
                                placeholder="Enter coupon name"
                                className="w-full bg-[#F5F7F9] border-none rounded-[16px] px-4 py-3.5 text-[14px] focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Coupon Type Toggle */}
                        <div>
                            <label className="block text-[13px] font-bold text-dark/80 mb-2">Coupon Type</label>
                            <div className="flex bg-[#F5F7F9] p-1 rounded-[16px]">
                                <button
                                    onClick={() => handleToggleType('Amount')}
                                    className={`flex-1 py-2.5 rounded-[12px] text-[13.5px] font-bold transition-all ${formData.type === 'Amount' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'
                                        }`}
                                >
                                    Amount
                                </button>
                                <button
                                    onClick={() => handleToggleType('Percentage')}
                                    className={`flex-1 py-2.5 rounded-[12px] text-[13.5px] font-bold transition-all ${formData.type === 'Percentage' ? 'bg-white text-primary shadow-sm border border-primary/10' : 'text-gray-400'
                                        }`}
                                >
                                    Percentage
                                </button>
                            </div>
                        </div>

                        {/* Coupon Details */}
                        <div>
                            <label className="block text-[13px] font-bold text-dark/80 mb-2">Coupon Details</label>
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <select
                                        className="w-full bg-[#F5F7F9] border-none rounded-[16px] px-4 py-3.5 text-[14px] appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
                                        value={formData.detailsHeader}
                                        onChange={(e) => setFormData({ ...formData, detailsHeader: e.target.value })}
                                    >
                                        <option>Upto</option>
                                        <option>Flat</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder={formData.type === 'Amount' ? "₹500" : "20%"}
                                    className="flex-[1.5] bg-[#F5F7F9] border-none rounded-[16px] px-4 py-3.5 text-[14px] focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                                    value={formData.detailsValue}
                                    onChange={(e) => setFormData({ ...formData, detailsValue: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Minimum Purchase Amount */}
                        <div>
                            <label className="block text-[13px] font-bold text-dark/80 mb-2">Minimum Purchase Amount</label>
                            <input
                                type="text"
                                placeholder="₹500"
                                className="w-full bg-[#F5F7F9] border-none rounded-[16px] px-4 py-3.5 text-[14px] focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                                value={formData.minPurchase}
                                onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                            />
                        </div>

                        {/* Usage Limit */}
                        <div>
                            <label className="block text-[13px] font-bold text-dark/80 mb-2">Coupon Usage Limit</label>
                            <input
                                type="text"
                                placeholder="Enter usage limit"
                                className="w-full bg-[#F5F7F9] border-none rounded-[16px] px-4 py-3.5 text-[14px] focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                                value={formData.usageLimit}
                                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                            />
                        </div>

                        {/* Dates */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-[13px] font-bold text-dark/80 mb-2">Start State</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="26/02/2026"
                                        className="w-full bg-[#F5F7F9] border-none rounded-[16px] px-4 py-3.5 text-[14px] focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-[13px] font-bold text-dark/80 mb-2">End State</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Date"
                                        className="w-full bg-[#F5F7F9] border-none rounded-[16px] px-4 py-3.5 text-[14px] focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-4 mt-10">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 bg-[#F5F7F9] hover:bg-[#EEF1F4] text-gray-400 font-bold rounded-[18px] transition-all active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onCreate(formData)}
                            className="flex-[1.5] py-4 bg-primary hover:bg-primary/95 text-white font-bold rounded-[18px] shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            {mode === 'edit' ? 'Save Coupon' : 'Create Coupon'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCouponModal;
