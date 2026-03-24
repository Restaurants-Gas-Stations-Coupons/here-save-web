import React, { useEffect } from 'react';

const ConfirmModal = ({
    isOpen,
    title = 'Confirm Action',
    message = 'Are you sure you want to continue?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    tone = 'danger',
    loading = false,
    onConfirm,
    onCancel,
}) => {
    useEffect(() => {
        if (!isOpen) return undefined;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const confirmButtonClass =
        tone === 'neutral'
            ? 'bg-[#1A1A1A] hover:bg-black text-white'
            : 'bg-primary hover:bg-primary/95 text-white';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <button
                type="button"
                aria-label="Close confirm dialog"
                className="absolute inset-0 bg-[#0E1B2C]/45 backdrop-blur-[2px]"
                onClick={loading ? undefined : onCancel}
            />

            <div className="relative w-full max-w-[420px] rounded-[24px] bg-white border border-[#E6EDF5] shadow-[0_20px_70px_rgba(14,27,44,0.3)] p-6">
                <h3 className="text-[20px] font-bold text-[#0E1B2C] leading-tight">{title}</h3>
                <p className="mt-3 text-[14px] text-[#55657A] leading-relaxed">{message}</p>

                <div className="mt-6 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 h-[48px] rounded-[16px] border border-[#D7E1EC] bg-white text-[#213246] text-[14px] font-semibold hover:bg-[#F6F9FC] disabled:opacity-60"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 h-[48px] rounded-[16px] text-[14px] font-semibold transition-colors disabled:opacity-60 ${confirmButtonClass}`}
                    >
                        {loading ? 'Please wait...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
