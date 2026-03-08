import React from 'react';

const BillSidebar = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
        <div className="w-[380px] flex flex-col h-full animate-in slide-in-from-right-10 duration-300">
            {/* Single Unified Card */}
            <div className="bg-white rounded-[32px] shadow-[0_4px_25px_rgba(0,0,0,0.05)] flex flex-col h-full border border-gray-100 overflow-hidden">
                {/* Internal Header Section */}
                <div className="bg-[#F3F7FA] m-4 rounded-[24px] p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center shrink-0 shadow-sm">
                            <img src="/images/oil.svg" alt="station" className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-[19px] font-bold text-dark leading-tight">BP Fuel Station</h3>
                            <p className="text-[12px] text-[#999999] font-medium leading-relaxed mt-1">
                                603AB Road, Kondapur,<br />
                                Hyderabad-500032, Telangana, India
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bill Details Content */}
                <div className="px-8 flex-1 overflow-y-auto no-scrollbar font-mono pb-8">
                    <div className="flex flex-col gap-5 pt-2">
                        <div className="space-y-1.5">
                            <p className="text-[13.5px] text-[#999999]">Bill Number: <span className="text-dark">INV-982341</span></p>
                            <p className="text-[13.5px] text-[#999999]">Date: <span className="text-dark">21 Feb 2026</span></p>
                            <p className="text-[13.5px] text-[#999999]">Time: <span className="text-dark">10:42 AM</span></p>
                            <p className="text-[13.5px] text-[#999999]">Staff Name: <span className="text-dark">Ravi Kumar</span></p>
                        </div>

                        <div className="pt-2">
                            <p className="text-[15px] font-bold text-dark font-onest mb-3">Fuel Details</p>
                            <div className="space-y-1.5 border-b border-dashed border-gray-100 pb-4">
                                <div className="flex justify-between text-[13.5px] text-[#999999]">
                                    <span>Fuel Type:</span>
                                    <span className="text-dark">Petrol (Normal)</span>
                                </div>
                                <div className="flex justify-between text-[13.5px] text-[#999999]">
                                    <span>Total Amount:</span>
                                    <span className="text-dark">Rs.2,050.00</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-[15px] font-bold text-dark font-onest mb-3">Coupon Details</p>
                            <div className="space-y-1.5 border-b border-dashed border-gray-100 pb-4">
                                <p className="text-[13.5px] text-dark font-bold font-onest">NEWYEAR OFF</p>
                                <div className="flex justify-between text-[13.5px] text-[#999999]">
                                    <span>Discount Amount:</span>
                                    <span className="text-dark">Rs. 100.00</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-[15px] font-bold text-dark font-onest mb-3">Billing Details</p>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[13.5px] text-[#999999]">
                                    <span>Total Amount:</span>
                                    <span className="text-dark">Rs. 2,050.00</span>
                                </div>
                                <div className="flex justify-between text-[13.5px] text-[#999999]">
                                    <span>Discount Amount:</span>
                                    <span className="text-dark">Rs. 100.00</span>
                                </div>
                                <div className="flex justify-between items-center text-[18px] font-bold text-dark pt-3 font-onest">
                                    <span>Net Payable:</span>
                                    <span>Rs. 1,950.00</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button className="w-full py-[18px] bg-[#F3F7FA] hover:bg-gray-100 text-dark font-bold text-[16px] rounded-[20px] transition-all active:scale-[0.98] font-onest shadow-sm">
                                Download Bill
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillSidebar;
