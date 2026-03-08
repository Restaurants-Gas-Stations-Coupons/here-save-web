import React from 'react';

const StatusBadge = ({ status }) => {
    const isActive = status === 'Active';
    return (
        <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${isActive ? 'bg-[#E8F5E9] text-green-600' : 'bg-red-50 text-red-500'
                }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-400'}`} />
            {status}
        </span>
    );
};

const StationDetailCard = ({ data }) => {
    return (
        <div className="bg-white rounded-[16px] px-6 py-5">
            {/* Header label */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#F3F7FA] flex items-center justify-center">
                    <img src="/images/oil.svg" alt="station" className="w-[18px] h-[18px]" />
                </div>
                <span className="text-[13px] font-medium text-dark">Station Details</span>
            </div>

            {/* Title + badge */}
            <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="text-[20px] font-semibold text-dark leading-tight">{data.name}</h2>
                <StatusBadge status={data.status} />
            </div>

            <p className="text-[13px] text-grayCustom mb-4">{data.address}</p>

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
            </div>
        </div>
    );
};

export default StationDetailCard;
