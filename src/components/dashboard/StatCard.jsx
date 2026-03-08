import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatBadge = ({ badge }) => {
    if (!badge) return null;

    if (badge.type === 'active') {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E8F5E9] text-green-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {badge.text}
            </span>
        );
    }

    const isUp = badge.type === 'up';
    return (
        <span
            className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${isUp ? 'bg-[#E8F5E9] text-green-600' : 'bg-red-50 text-red-500'
                }`}
        >
            {isUp ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
            {badge.text}
        </span>
    );
};

// The 4 stats laid out as columns inside one section — matching Figma exactly
const StatsSectionRow = ({ stats }) => {
    return (
        <div className="grid grid-cols-4 gap-0 divide-x divide-gray-100">
            {stats.map((stat) => (
                <div key={stat.id} className="px-5 py-4 first:pl-0">
                    <p className="text-[12px] text-grayCustom mb-2">{stat.label}</p>
                    <div className="flex items-end justify-between">
                        <p className="text-[28px] font-semibold text-dark leading-none tracking-tight">{stat.value}</p>
                        <div className="mb-0.5">
                            <StatBadge badge={stat.badge} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsSectionRow;
