import React from 'react';
import FullTransactionRow from './FullTransactionRow';

const TransactionHistoryView = ({ transactions = [], selectedId, onViewBill }) => {
    return (
        <div className="bg-white rounded-[24px] px-8 py-7 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#F3F7FA] flex items-center justify-center">
                    <img src="/images/transactionhis.png" alt="transactions" className="w-[22px] h-[22px]" />
                </div>
                <h2 className="text-[18px] font-bold text-dark">Transaction History</h2>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
                {transactions.map((tx) => (
                    <FullTransactionRow
                        key={tx.id}
                        transaction={tx}
                        isSelected={selectedId === tx.id}
                        onViewBill={onViewBill}
                    />
                ))}
            </div>
        </div>
    );
};

export default TransactionHistoryView;
