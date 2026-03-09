import React, { useState } from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

/**
 * CouponCard — reusable ticket-shaped card built from the exact Figma SVG path.
 */
const CouponCard = ({
    coupon,
    onRedeem,
    onEdit,
    onDelete,
    onCancel,
    onApprove,
    onReApprove,
    scale = 1.25,
    variant = 'simplified',
    status = 'Approved', // 'Approved' | 'Pending' | 'Rejected'
    isSelected = false,
    role = 'admin',
    onClick
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const W = 156;
    const H = 211;
    const notchPct = (156 / H) * 100;
    const w = W * scale;
    const h = H * scale;
    const notchY = 156 * scale;

    const isDetailed = variant === 'detailed';

    return (
        <div
            className="shrink-0 flex flex-col items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="relative group cursor-pointer transition-transform active:scale-[0.98]"
                style={{ width: w, height: h }}
                onClick={() => onClick && onClick(coupon.id)}
            >
                {/* SVG shape layer */}
                <svg
                    viewBox="0 0 156 211"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 w-full h-full drop-shadow-[0_4px_30px_rgba(0,0,0,0.08)]"
                    aria-hidden="true"
                >
                    <path
                        d="M138 9C142.418 9 146 12.5817 146 17V144C139.373 144 134 149.373 134 156C134 162.627 139.373 168 146 168V192C146 196.418 142.418 200 138 200H18C13.5817 200 10 196.418 10 192V168C16.6274 168 22 162.627 22 156C22 149.373 16.6274 144 10 144V17C10 12.5817 13.5817 9 18 9H138Z"
                        fill="white"
                    />
                    <line
                        x1="22" y1="156" x2="134" y2="156"
                        stroke="#F2F2F2" strokeWidth="1.5" strokeDasharray="5 4"
                    />
                </svg>

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col">
                    <div
                        className="flex flex-col items-center"
                        style={{ height: `${notchY}px`, paddingTop: '42px' }}
                    >
                        <p className="text-[10px] font-bold text-dark tracking-[0.14em] uppercase text-center leading-tight mb-11">
                            {coupon.offer}
                        </p>

                        <div className="flex flex-col items-center">
                            <div className="flex flex-col items-start w-fit">
                                <p className="text-[14px] font-bold text-dark uppercase leading-none mb-1.5">
                                    {coupon.type}
                                </p>
                                <div className="flex items-center gap-0.5">
                                    <span className="text-[28px] font-black text-dark leading-none tracking-tighter">
                                        {coupon.discount}
                                    </span>
                                    <span className="text-[13px] font-black text-dark uppercase self-end mb-1">
                                        {coupon.unit}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom zone — Centered Footer */}
                    <div
                        className="flex items-center justify-center -mt-1"
                        style={{ height: `${100 - notchPct}%` }}
                    >
                        {isDetailed ? (
                            <div className={`flex items-center gap-1.5 ${status === 'Approved' ? 'text-[#34C759]' :
                                status === 'Pending' ? 'text-[#FFCC00]' : 'text-primary'
                                }`}>
                                {status === 'Approved' && <CheckCircle2 size={18} strokeWidth={3} />}
                                {status === 'Pending' && <Clock size={18} strokeWidth={3} />}
                                {status === 'Rejected' && <XCircle size={18} strokeWidth={3} />}
                                <span className="text-[14px] font-bold uppercase tracking-tight">{status}</span>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRedeem && onRedeem(coupon.id);
                                }}
                                className="text-[15px] font-bold text-primary tracking-normal leading-none font-onest uppercase hover:opacity-70 transition-opacity"
                            >
                                REDEEM
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions (Floating style matching reference) */}
            {isDetailed && (isHovered || isSelected) && (
                <div className="relative z-10 flex items-center gap-2 mt-6 px-1 w-full max-w-[175px] animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit && onEdit(coupon.id);
                        }}
                        className="flex-1 py-3 px-1 bg-white hover:bg-gray-50 text-dark text-[13px] font-bold rounded-[14px] transition-all shadow-md shadow-black/5 border border-gray-100 uppercase"
                    >
                        Edit
                    </button>
                    {status === 'Pending' ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCancel && onCancel(coupon.id);
                            }}
                            className="flex-1 py-3 px-1 bg-[#1A1A1A] hover:bg-black text-white text-[13px] font-bold rounded-[14px] shadow-lg transition-all active:scale-95 uppercase"
                        >
                            Cancel
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete && onDelete(coupon.id);
                            }}
                            className="flex-1 py-3 px-1 bg-primary hover:bg-primary/95 text-white text-[13px] font-bold rounded-[14px] shadow-md shadow-primary/25 transition-all active:scale-95 uppercase"
                        >
                            Delete
                        </button>
                    )}
                </div>
            )}

            {/* Superadmin Default Actions (When NOT hovered/selected) */}
            {isDetailed && !(isHovered || isSelected) && role === 'superadmin' && (status === 'Pending' || status === 'Rejected') && (
                <div className="relative z-10 flex items-center gap-2 mt-6 px-1 w-full max-w-[175px] animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (status === 'Pending' && onApprove) onApprove();
                            if (status === 'Rejected' && onReApprove) onReApprove();
                        }}
                        className="flex-1 py-3 px-1 bg-[#DC0004] hover:bg-[#DC0004]/95 text-white text-[13px] font-bold rounded-[14px] shadow-md shadow-[#DC0004]/25 transition-all active:scale-95 uppercase"
                    >
                        {status === 'Pending' ? 'Approve' : 'Re-Approve'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CouponCard;
