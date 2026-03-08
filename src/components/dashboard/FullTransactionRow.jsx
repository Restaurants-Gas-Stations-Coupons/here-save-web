import React from 'react';

const STATUS_STYLES = {
    Approved: 'text-[#00C853] font-bold',
    Pending: 'text-[#FFAB00] font-bold',
    Rejected: 'text-[#DC0004] font-bold',
};

const FullTransactionRow = ({ transaction, isSelected, onViewBill }) => {
    return (
        <div className={`flex items-center gap-4 px-8 py-4 rounded-[16px] transition-all mb-2 ${isSelected ? 'bg-white shadow-sm ring-1 ring-gray-100' : 'bg-[#F3F7FA] hover:bg-gray-100'}`}>
            <div className="w-[100px] shrink-0">
                <span className={`text-[14.5px] ${STATUS_STYLES[transaction.status] || 'text-[#999999]'}`}>
                    {transaction.status}
                </span>
            </div>

            <div className="flex items-baseline gap-1.5 w-[150px] shrink-0">
                <span className="text-[17px] font-bold text-dark">{transaction.amount}</span>
                <span className="text-[14.5px] text-[#999999] font-medium">({transaction.discount})</span>
            </div>

            <div className="flex-1">
                <span className="text-[15px] text-[#999999] font-medium">
                    Coupon ID: <span className="text-dark font-bold">{transaction.couponId}</span>
                </span>
            </div>

            <div className="w-[180px] text-right shrink-0">
                <span className="text-[14.5px] text-[#999999] font-medium">
                    {transaction.date} • {transaction.time}
                </span>
            </div>

            <div className="ml-4 shrink-0">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewBill(transaction.id);
                    }}
                    className={`text-[14.5px] font-bold underline decoration-2 underline-offset-4 hover:opacity-80 transition-all ${isSelected ? 'text-primary' : 'text-dark'}`}
                >
                    View Bill
                </button>
            </div>
        </div>
    );
};

export default FullTransactionRow;
