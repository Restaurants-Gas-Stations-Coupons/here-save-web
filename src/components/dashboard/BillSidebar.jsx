import React from 'react';
import { Fuel, Utensils, X } from 'lucide-react';
import { downloadRedemptionBillPdf } from '../../utils/redemptionBillDownload';

const inr = (n) => {
    const v = Number(n);
    if (!Number.isFinite(v)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(v);
};

/**
 * @param {object} props
 * @param {Record<string, unknown>} props.transaction
 * @param {() => void} props.onClose
 * @param {'station' | 'restaurant'} [props.entityType]
 */
const BillSidebar = ({ transaction, onClose, entityType = 'station' }) => {
    if (!transaction) return null;

    const billRef = transaction.billNumber
        ? String(transaction.billNumber)
        : `Redemption #${transaction.id}`;

    const outletName = transaction.outletName || 'Outlet';
    const outletAddress = transaction.outletAddress || '—';
    const couponTitle = (transaction.couponTitle || transaction.couponId || 'Coupon').toString();
    const fuelLabel = transaction.fuelType ? String(transaction.fuelType) : '—';
    const billAmt = inr(transaction.billAmount);
    const discAmt = inr(transaction.discountAmount);
    const netAmt = inr(
        transaction.finalAmount != null
            ? transaction.finalAmount
            : Number(transaction.billAmount || 0) - Number(transaction.discountAmount || 0),
    );

    const isRestaurant = entityType === 'restaurant';

    return (
        <div className="w-[380px] flex flex-col h-full animate-in slide-in-from-right-10 duration-300 shrink-0">
            <div className="bg-white rounded-[32px] shadow-[0_4px_25px_rgba(0,0,0,0.05)] flex flex-col h-full border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-end px-4 pt-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-[#666] transition-colors"
                        aria-label="Close bill"
                    >
                        <X size={20} strokeWidth={2} />
                    </button>
                </div>
                <div className="bg-[#F3F7FA] mx-4 rounded-[24px] p-6 -mt-1">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center shrink-0 shadow-sm text-primary">
                            {isRestaurant ? (
                                <Utensils className="w-6 h-6" strokeWidth={2} />
                            ) : (
                                <Fuel className="w-6 h-6" strokeWidth={2} />
                            )}
                        </div>
                        <div>
                            <h3 className="text-[19px] font-bold text-dark leading-tight">{outletName}</h3>
                            <p className="text-[12px] text-[#999999] font-medium leading-relaxed mt-1">
                                {outletAddress}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-8 flex-1 overflow-y-auto no-scrollbar font-mono pb-8">
                    <div className="flex flex-col gap-5 pt-2">
                        <div className="space-y-1.5">
                            <p className="text-[13.5px] text-[#999999]">
                                Bill number: <span className="text-dark font-semibold">{billRef}</span>
                            </p>
                            <p className="text-[13.5px] text-[#999999]">
                                Date: <span className="text-dark">{transaction.date}</span>
                            </p>
                            <p className="text-[13.5px] text-[#999999]">
                                Time: <span className="text-dark">{transaction.time}</span>
                            </p>
                        </div>

                        <div className="pt-2">
                            <p className="text-[15px] font-bold text-dark font-onest mb-3">
                                {isRestaurant ? 'Order details' : 'Fuel details'}
                            </p>
                            <div className="space-y-1.5 border-b border-dashed border-gray-100 pb-4">
                                <div className="flex justify-between text-[13.5px] text-[#999999]">
                                    <span>{isRestaurant ? 'Category' : 'Fuel type'}</span>
                                    <span className="text-dark">{fuelLabel}</span>
                                </div>
                                <div className="flex justify-between text-[13.5px] text-[#999999]">
                                    <span>Bill amount</span>
                                    <span className="text-dark">{billAmt}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-[15px] font-bold text-dark font-onest mb-3">Coupon details</p>
                            <div className="space-y-1.5 border-b border-dashed border-gray-100 pb-4">
                                <p className="text-[13.5px] text-dark font-bold font-onest">{couponTitle}</p>
                                <div className="flex justify-between text-[13.5px] text-[#999999]">
                                    <span>Discount amount</span>
                                    <span className="text-dark">{discAmt}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-[15px] font-bold text-dark font-onest mb-3">Billing details</p>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[13.5px] text-[#999999]">
                                    <span>Total amount</span>
                                    <span className="text-dark">{billAmt}</span>
                                </div>
                                <div className="flex justify-between text-[13.5px] text-[#999999]">
                                    <span>Discount amount</span>
                                    <span className="text-dark">{discAmt}</span>
                                </div>
                                <div className="flex justify-between items-center text-[18px] font-bold text-dark pt-3 font-onest">
                                    <span>Net payable</span>
                                    <span>{netAmt}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                type="button"
                                onClick={() => downloadRedemptionBillPdf(transaction)}
                                className="w-full py-[18px] bg-[#F3F7FA] hover:bg-gray-100 text-dark font-bold text-[16px] rounded-[20px] transition-all active:scale-[0.98] font-onest shadow-sm"
                            >
                                Download bill
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillSidebar;
