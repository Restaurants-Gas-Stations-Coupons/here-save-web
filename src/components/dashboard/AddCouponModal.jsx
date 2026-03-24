import React, { useState, useEffect } from 'react';
import { X, Ticket } from 'lucide-react';
import DatePicker from '../ui/DatePicker';

const Field = ({ label, error, children }) => (
    <div>
        {label && <label className="block text-[13px] font-bold text-dark/80 mb-2">{label}</label>}
        {children}
        {error && <p className="mt-1.5 text-[12px] text-red-500 ml-1 flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-[9px] font-black text-red-500 flex-shrink-0">!</span>
            {error}
        </p>}
    </div>
);

const AddCouponModal = ({ isOpen, onClose, onCreate, initialData, mode = 'add' }) => {
    const todayISO = new Date().toISOString().split('T')[0];

    const emptyForm = {
        name: '',
        type: 'Amount',            // 'Amount' | 'Percentage'
        detailsHeader: 'Flat',     // 'Flat' | 'Upto'
        detailsValue: '',
        minPurchase: '',
        usageLimit: '',
        startDate: '',
        endDate: '',
    };

    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            if (initialData && mode === 'edit') {
                setFormData({
                    name: initialData.name || '',
                    type: initialData.type === 'PERCENTAGE' ? 'Percentage' : (initialData.type || 'Amount'),
                    detailsHeader: initialData.detailsHeader || 'Flat',
                    detailsValue: initialData.discountValue || initialData.discount || '',
                    minPurchase: initialData.minPurchase || '',
                    usageLimit: initialData.usageLimit || '',
                    startDate: initialData.startDate || '',
                    endDate: initialData.endDate || '',
                });
            } else {
                setFormData(emptyForm);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, mode]);

    useEffect(() => {
        if (!isOpen) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const setField = (key, val) => {
        setFormData(prev => ({ ...prev, [key]: val }));
        // Clear error when user edits
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    };

    const validate = () => {
        const e = {};

        if (!formData.name.trim()) e.name = 'Coupon name is required.';
        else if (formData.name.trim().length < 3) e.name = 'Name must be at least 3 characters.';

        const val = parseFloat(formData.detailsValue);
        if (!formData.detailsValue) e.detailsValue = 'Discount value is required.';
        else if (isNaN(val) || val <= 0) e.detailsValue = 'Must be a positive number.';
        else if (formData.type === 'Percentage' && val > 100) e.detailsValue = 'Percentage cannot exceed 100.';

        if (formData.minPurchase && isNaN(parseFloat(formData.minPurchase)))
            e.minPurchase = 'Must be a valid number.';

        if (formData.usageLimit) {
            const ul = parseInt(formData.usageLimit);
            if (isNaN(ul) || ul <= 0) e.usageLimit = 'Must be a positive whole number.';
        }

        if (!formData.startDate) e.startDate = 'Start date is required.';

        if (formData.endDate && formData.startDate && formData.endDate <= formData.startDate)
            e.endDate = 'End date must be after start date.';

        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setSubmitting(true);
        try {
            await onCreate(formData);
        } finally {
            setSubmitting(false);
        }
    };

    const inputCls = (hasError) =>
        `w-full h-[48px] bg-[#F5F7F9] border-none rounded-[16px] px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 ${hasError ? 'ring-2 ring-red-400' : ''}`;

    const detailModeOptions = formData.type === 'Amount' ? ['Flat'] : ['Flat', 'Upto'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[12px]" onClick={onClose} />

            <div className="relative bg-white w-full max-w-[400px] h-[696px] max-h-[calc(100vh-32px)] rounded-[24px] shadow-2xl overflow-visible animate-in fade-in zoom-in duration-200">
                <div className="px-8 pt-8 pb-7">
                    {/* Close button */}
                    <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400">
                        <X size={16} />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-full bg-[#FFF5F5] flex items-center justify-center">
                            <Ticket className="text-primary" size={20} />
                        </div>
                        <h2 className="text-[20px] font-bold text-dark">
                            {mode === 'edit' ? 'Edit Coupon' : 'Add Coupon'}
                        </h2>
                    </div>

                    {/* Form */}
                    <div className="space-y-3">
                        {/* Name */}
                        <Field label="Coupon Name" error={errors.name}>
                            <input
                                type="text"
                                placeholder="e.g. Summer Sale 20% Off"
                                className={inputCls(!!errors.name)}
                                value={formData.name}
                                onChange={(e) => setField('name', e.target.value)}
                            />
                        </Field>

                        {/* Type Toggle */}
                        <div>
                            <label className="block text-[13px] font-bold text-dark/80 mb-2">Coupon Type</label>
                            <div className="flex gap-3">
                                {['Amount', 'Percentage'].map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => {
                                            setField('type', t);
                                            if (t === 'Amount') setField('detailsHeader', 'Flat');
                                        }}
                                        className={`flex-1 h-[48px] rounded-[16px] text-[13.5px] font-bold transition-all border ${formData.type === t ? 'bg-white text-primary border-primary' : 'bg-[#F5F7F9] text-gray-400 border-transparent'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Coupon Details */}
                        <Field label="Coupon Details" error={errors.detailsValue}>
                            <div className="flex gap-3">
                                <div className="relative w-[120px]">
                                    <select
                                        value={formData.detailsHeader}
                                        onChange={(e) => setField('detailsHeader', e.target.value)}
                                        className={`${inputCls(false)} appearance-none cursor-pointer`}
                                    >
                                        {detailModeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#939393" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    max={formData.type === 'Percentage' ? '100' : undefined}
                                    placeholder={formData.type === 'Amount' ? '₹500' : '20'}
                                    className={`${inputCls(!!errors.detailsValue)} flex-1`}
                                    value={formData.detailsValue}
                                    onChange={(e) => setField('detailsValue', e.target.value)}
                                />
                            </div>
                        </Field>

                        {/* Min Purchase */}
                        <Field label="Minimum Purchase Amount" error={errors.minPurchase}>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[14px] font-medium">₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="500"
                                    className={`${inputCls(!!errors.minPurchase)} pl-8`}
                                    value={formData.minPurchase}
                                    onChange={(e) => setField('minPurchase', e.target.value)}
                                />
                            </div>
                        </Field>

                        {/* Usage Limit */}
                        <Field label="Coupon Usage Limit" error={errors.usageLimit}>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                placeholder="e.g. 100"
                                className={inputCls(!!errors.usageLimit)}
                                value={formData.usageLimit}
                                onChange={(e) => setField('usageLimit', e.target.value)}
                            />
                        </Field>

                        {/* Dates */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <DatePicker
                                    label="Start Date"
                                    value={formData.startDate}
                                    onChange={(v) => {
                                        setField('startDate', v);
                                        // Clear end date error if start changes
                                        setErrors(prev => ({ ...prev, endDate: '' }));
                                    }}
                                    minDate={todayISO}
                                    maxDate={formData.endDate || undefined}
                                    error={errors.startDate}
                                />
                            </div>
                            <div className="flex-1">
                                <DatePicker
                                    label="End Date"
                                    value={formData.endDate}
                                    onChange={(v) => setField('endDate', v)}
                                    disabled={!formData.startDate}
                                    minDate={formData.startDate ? (() => {
                                        const d = new Date(formData.startDate);
                                        d.setDate(d.getDate() + 1);
                                        return d.toISOString().split('T')[0];
                                    })() : undefined}
                                    error={errors.endDate}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 mt-5">
                        <button onClick={onClose}
                            className="flex-1 h-[48px] bg-[#F5F7F9] hover:bg-[#EEF1F4] text-gray-500 font-bold rounded-[16px] transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex-1 h-[48px] bg-primary hover:bg-primary/95 text-white font-bold rounded-[16px] shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Saving...' : mode === 'edit' ? 'Save Coupon' : 'Create Coupon'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCouponModal;
