import React from 'react';

const ProfilePopover = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-[64px] w-[400px] bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 animate-pop-in">
            <div className="flex items-center gap-6">
                {/* Avatar with glow effect matching image */}
                <div className="relative shrink-0">
                    <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-2 border-white shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2574&auto=format&fit=crop"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <h2 className="text-[19px] font-bold text-dark leading-tight -mb-1">Kushal Bysani</h2>
                    <p className="text-[14px] text-[#999999] font-medium mb-1">Manager</p>
                    <p className="text-[14px] text-dark font-medium">
                        <span className="text-[#999999]">Employee ID:</span> AB165800
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePopover;
