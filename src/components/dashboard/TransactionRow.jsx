import React from 'react';

const STATUS_STYLES = {
    Approved: 'text-green-600 bg-green-50',
    Pending: 'text-yellow-600 bg-yellow-50',
    Rejected: 'text-red-500 bg-red-50',
};

const TransactionRow = ({ transaction }) => {
    const statusStyle = STATUS_STYLES[transaction.status] || 'text-grayCustom bg-gray-100';

    return (
        <div className="flex items-center gap-4 px-4 py-3 rounded-[12px] bg-[#F3F7FA] mb-2 last:mb-0">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md shrink-0 ${statusStyle}`}>
                {transaction.status}
            </span>
            <div className="flex items-baseline gap-1 min-w-[120px]">
                <span className="text-[13px] font-semibold text-dark">{transaction.amount}</span>
                <span className="text-[11px] text-grayCustom">({transaction.discount})</span>
            </div>
            <span className="text-[13px] text-grayCustom flex-1">
                Coupon ID: <span className="font-semibold text-dark">{transaction.couponId}</span>
            </span>
            <span className="text-[11px] text-grayCustom shrink-0">
                {transaction.date} • {transaction.time}
            </span>
        </div>
    );
};

export default TransactionRow;
