import React, { useRef, useState } from 'react';
import { Edit, Utensils } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const normalizedStatus = String(status || '').toUpperCase();
    const isActive = normalizedStatus === 'ACTIVE';
    const displayStatus = status || 'UNKNOWN';
    return (
        <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${isActive ? 'bg-[#E8F5E9] text-green-600' : 'bg-red-50 text-red-500'
                }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-400'}`} />
            {displayStatus}
        </span>
    );
};

const StationDetailCard = ({ data, role, onEdit, onDeactivate, entityType = 'station' }) => {
    const isRestaurant = entityType === 'restaurant';
    const entityName = isRestaurant ? 'Restaurant' : 'Station';
    const images = Array.isArray(data.outletImages) ? data.outletImages.filter(Boolean) : [];
    const scrollRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState(0);

    return (
        <div className="bg-white rounded-[16px] px-6 py-5">
            {/* Header label & Actions */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#F3F7FA] flex items-center justify-center">
                        {isRestaurant ? <Utensils className="w-[18px] h-[18px] text-grayCustom" strokeWidth={1.5} /> : <img src="/images/oil.svg" alt="station" className="w-[18px] h-[18px]" />}
                    </div>
                    <span className="text-[13px] font-semibold text-dark">{entityName} Details</span>
                </div>

                {/* Superadmin Actions */}
                {role === 'superadmin' && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-[12px] text-[13px] font-semibold text-dark hover:bg-gray-50 transition-all"
                        >
                            <Edit size={14} />
                            Edit
                        </button>
                        <button
                            onClick={onDeactivate}
                            disabled={String(data.status || '').toUpperCase() === 'DEACTIVATED'}
                            className="flex items-center gap-2 px-4 py-2 border border-[#FFDADA] bg-white rounded-[12px] text-[13px] font-semibold text-[#DC0004] hover:bg-[#FFF5F5] transition-all"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DC0004]" />
                            {String(data.status || '').toUpperCase() === 'DEACTIVATED'
                                ? `${entityName} Deactivated`
                                : `Deactivate ${entityName}`}
                        </button>
                    </div>
                )}
            </div>

            {/* Title + badge */}
            <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="text-[20px] font-semibold text-dark leading-tight">{data.name}</h2>
                <StatusBadge status={data.status} />
            </div>

            <p className="text-[13px] text-grayCustom mb-4">{data.address}</p>

            {images.length > 0 && (
                <div className="mb-4">
                    <div
                        ref={scrollRef}
                        className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar"
                        onScroll={(e) => {
                            const node = e.currentTarget;
                            const width = node.clientWidth;
                            if (!width) return;
                            const next = Math.round(node.scrollLeft / width);
                            if (next !== activeSlide) setActiveSlide(next);
                        }}
                    >
                        {images.map((img, idx) => (
                            <div key={`${idx}-${img.slice(0, 24)}`} className="min-w-full snap-start">
                                <img
                                    src={img}
                                    alt={`${entityName} ${idx + 1}`}
                                    className="w-full h-[180px] object-cover rounded-[12px] border border-[#EEEEEE]"
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                    {images.length > 1 && (
                        <div className="flex items-center justify-center gap-1.5 mt-2">
                            {images.map((_, idx) => (
                                <span
                                    key={`dot-${idx}`}
                                    className={`w-1.5 h-1.5 rounded-full ${idx === activeSlide ? 'bg-[#DC0004]' : 'bg-[#D1D5DB]'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Meta row */}
            <div className="bg-[#F3F7FA] rounded-[12px] px-5 py-3.5 flex gap-12 flex-wrap">
                <div>
                    <p className="text-[11px] text-grayCustom mb-1">Outlet ID</p>
                    <p className="text-[13px] font-semibold text-dark">{data.outletId}</p>
                </div>
                <div>
                    <p className="text-[11px] text-grayCustom mb-1">Manager</p>
                    <p className="text-[13px] font-semibold text-dark">{data.manager}</p>
                </div>
                <div>
                    <p className="text-[11px] text-grayCustom mb-1">Contact</p>
                    <p className="text-[13px] font-semibold text-dark">{data.contact}</p>
                </div>
                {(data.latitude != null && data.latitude !== '' && data.longitude != null && data.longitude !== '') && (
                    <div>
                        <p className="text-[11px] text-grayCustom mb-1">Location</p>
                        <p className="text-[13px] font-semibold text-dark font-mono tabular-nums">
                            {Number(data.latitude).toFixed(7)}, {Number(data.longitude).toFixed(7)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StationDetailCard;
