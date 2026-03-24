import React, { useEffect, useMemo, useState } from 'react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';

const TOAST_EVENT_NAME = 'app:toast';

const toneStyles = {
    error: {
        container: 'bg-[#FFF4F4] border-[#FFD9D9] text-[#8A1F1F]',
        icon: <CircleAlert size={18} className="text-[#DC0004]" />,
    },
    success: {
        container: 'bg-[#F1FFF5] border-[#CCEFD8] text-[#1F5C34]',
        icon: <CircleCheck size={18} className="text-[#1F9D55]" />,
    },
    info: {
        container: 'bg-[#F3F7FF] border-[#D8E4FF] text-[#1E3A8A]',
        icon: <Info size={18} className="text-[#2563EB]" />,
    },
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const ToastHost = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const onToast = (event) => {
            const payload = event?.detail || {};
            const message = String(payload.message || '').trim();
            if (!message) return;

            const toast = {
                id: makeId(),
                type: payload.type || 'info',
                message,
                duration: Number(payload.duration) > 0 ? Number(payload.duration) : 3500,
            };

            setToasts((prev) => [...prev, toast].slice(-4));
        };

        window.addEventListener(TOAST_EVENT_NAME, onToast);
        return () => window.removeEventListener(TOAST_EVENT_NAME, onToast);
    }, []);

    useEffect(() => {
        if (toasts.length === 0) return undefined;

        const timers = toasts.map((toast) =>
            window.setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }, toast.duration)
        );

        return () => timers.forEach((timer) => window.clearTimeout(timer));
    }, [toasts]);

    const visibleToasts = useMemo(() => toasts.slice().reverse(), [toasts]);

    return (
        <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
            {visibleToasts.map((toast) => {
                const tone = toneStyles[toast.type] || toneStyles.info;
                return (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto min-w-[280px] max-w-[380px] rounded-[14px] border shadow-[0_10px_26px_rgba(14,27,44,0.14)] px-4 py-3 flex items-start gap-3 ${tone.container}`}
                    >
                        <span className="shrink-0 mt-0.5">{tone.icon}</span>
                        <p className="text-[13px] leading-[18px] font-medium flex-1">{toast.message}</p>
                        <button
                            type="button"
                            aria-label="Close"
                            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                            className="shrink-0 opacity-70 hover:opacity-100"
                        >
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default ToastHost;
