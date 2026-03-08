import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { ArrowLeftRight, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

const LEGEND_COLORS = {
    redemptions: '#F9A8D4',
    discounts: '#FDE68A',
    totalSales: '#C4B5FD',
};

const LABELS = {
    redemptions: 'Redemptions',
    discounts: 'Discounts',
    totalSales: 'Total Sales',
};

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
        <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isUp ? 'bg-[#E8F5E9] text-green-600' : 'bg-red-50 text-red-500'}`}>
            {isUp ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
            {badge.text}
        </span>
    );
};

/**
 * Individual stat card — standalone white rounded card.
 * Reusable: pass label, value and badge from any data source.
 */
const StatCard = ({ stat }) => (
    <div className="flex-1 bg-white rounded-[16px] px-5 py-4 flex flex-col justify-between min-w-0">
        <p className="text-[12px] text-grayCustom mb-3">{stat.label}</p>
        <div className="flex items-end justify-between gap-2">
            <p className="text-[28px] font-semibold text-dark leading-none tracking-tight">{stat.value}</p>
            <div className="pb-0.5 shrink-0">
                <StatBadge badge={stat.badge} />
            </div>
        </div>
    </div>
);

const CustomLegend = () => (
    <div className="flex items-center gap-5 justify-end mb-4">
        {Object.entries(LEGEND_COLORS).map(([key, color]) => (
            <span key={key} className="flex items-center gap-1.5 text-[12px] text-dark">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                {LABELS[key]}
            </span>
        ))}
    </div>
);

/**
 * StatsChart — reusable section.
 * Props:
 *   data       — array of chart data points (from API or dummy)
 *   statsData  — array of stat objects { id, label, value, badge }
 *   defaultFilter — string shown in the filter pill
 */
const StatsChart = ({ data, statsData, defaultFilter = 'Today' }) => {
    const [filter, setFilter] = React.useState(defaultFilter);

    return (
        /* Outer light-gray section card — NO white bg on the header row */
        <div className="flex flex-col gap-3">

            {/* Header row — lives directly on the gray bg, no card */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <img src="/images/statsimg.png" alt="stats" className="w-4 h-4" />
                    </div>
                    <span className="text-[14px] font-semibold text-dark">Statastics</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-[10px] px-3 py-1.5 text-[12px] text-dark cursor-pointer">
                    <ArrowLeftRight size={12} className="text-grayCustom" />
                    <span>{filter}</span>
                    <ChevronDown size={12} className="text-grayCustom" />
                </div>
            </div>

            {/* 4 separate white stat cards */}
            {statsData && (
                <div className="flex gap-3">
                    {statsData.map((stat) => (
                        <StatCard key={stat.id} stat={stat} />
                    ))}
                </div>
            )}

            {/* Chart white card */}
            <div className="bg-white rounded-[16px] px-5 py-5">
                <CustomLegend />
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EBEBEB" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#939393' }} axisLine={false} tickLine={false} />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#939393' }}
                            axisLine={false}
                            tickLine={false}
                            width={50}
                            tickFormatter={(v) => v >= 1000 ? (v / 1000).toFixed(0) + '000' : v}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: 12 }}
                        />
                        <Line type="monotone" dataKey="redemptions" stroke={LEGEND_COLORS.redemptions} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                        <Line type="monotone" dataKey="discounts" stroke={LEGEND_COLORS.discounts} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                        <Line type="monotone" dataKey="totalSales" stroke={LEGEND_COLORS.totalSales} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export { StatCard, StatBadge };
export default StatsChart;
