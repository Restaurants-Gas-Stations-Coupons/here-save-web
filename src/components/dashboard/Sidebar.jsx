import React from 'react';
import { LayoutDashboard, Ticket, Users } from 'lucide-react';

const ICON_MAP = {
    LayoutDashboard,
    Ticket,
    Users,
};

const Sidebar = ({ data, activeNav, onNavChange }) => {
    return (
        <aside className="w-[200px] min-h-screen bg-white flex flex-col pt-6 pb-8 px-5 shrink-0 border-r border-gray-100">
            {/* Logo */}
            <div className="mb-7 px-1">
                <span className="text-primary font-bold text-[20px] leading-[1.15] block">
                    Here&<br />Save
                </span>
            </div>

            {/* Station Info */}
            <div className="bg-[#F3F7FA] rounded-[12px] p-3 mb-7">
                <div className="flex items-center gap-1.5 mb-1.5">
                    <img src="/images/oil.svg" alt="station" className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] font-semibold text-dark truncate leading-tight">{data.stationLabel}</span>
                </div>
                <p className="text-[9px] text-grayCustom leading-[1.5]">{data.stationAddress}</p>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-0.5">
                {data.navItems.map((item) => {
                    const Icon = ICON_MAP[item.icon];
                    const isActive = activeNav === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavChange(item.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-colors text-left w-full ${isActive
                                ? 'text-primary'
                                : 'text-grayCustom hover:text-dark'
                                }`}
                        >
                            {Icon && <Icon size={15} strokeWidth={isActive ? 2 : 1.5} />}
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
