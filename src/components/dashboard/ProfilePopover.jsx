import React from 'react';

const roleLabel = (role) => {
    if (role === 'SUPER_ADMIN') return 'Super Admin';
    if (role === 'OUTLET_ADMIN') return 'Outlet Admin';
    if (role === 'EMPLOYEE') return 'Employee';
    if (role === 'USER') return 'User';
    return role || 'User';
};

const getInitials = (name) => {
    const n = (name || '').trim();
    if (!n) return 'U';
    const parts = n.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() || '').join('') || 'U';
};

const ProfilePopover = ({ isOpen, onClose, user, onLogout }) => {
    if (!isOpen) return null;

    const name = user?.full_name || 'User';
    const role = roleLabel(user?.role);
    const employeeId = user?.id ? `EMP-${String(user.id).padStart(6, '0')}` : 'N/A';

    return (
        <div className="absolute right-0 top-[64px] w-[400px] bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 animate-pop-in">
            <div className="flex items-center gap-6">
                {/* Avatar with glow effect matching image */}
                <div className="relative shrink-0">
                    <div className="w-[80px] h-[80px] rounded-full border-2 border-white shadow-lg bg-[#F3F7FA] flex items-center justify-center text-[24px] font-bold text-primary">
                        {getInitials(name)}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <h2 className="text-[19px] font-bold text-dark leading-tight">
                        {name}
                    </h2>
                    <div className="flex flex-col gap-1">
                        <p className="text-[14px] leading-[20px] text-[#999999] font-medium">{role}</p>
                        <p className="text-[14px] leading-[20px] text-dark font-medium flex items-center gap-1.5">
                            <span className="text-[#999999]">Employee ID:</span>
                            <span>{employeeId}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                    onClick={() => {
                        onClose?.();
                        onLogout?.();
                    }}
                    className="w-full h-[44px] rounded-[12px] bg-[#DC0004] text-white text-[14px] font-semibold hover:bg-[#c40008] transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfilePopover;
