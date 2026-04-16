import React from 'react';
import { Bell, CheckCircle, XCircle, UserPlus, UserMinus, RefreshCw, Store, Gift, Clock } from 'lucide-react';

const typeIcons = {
    COUPON_PENDING: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    COUPON_APPROVED: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    COUPON_REJECTED: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
    COUPON_CREATED: { icon: Gift, color: 'text-blue-500', bg: 'bg-blue-50' },
    EMPLOYEE_ADDED: { icon: UserPlus, color: 'text-green-500', bg: 'bg-green-50' },
    EMPLOYEE_UPDATED: { icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-50' },
    EMPLOYEE_REMOVED: { icon: UserMinus, color: 'text-red-500', bg: 'bg-red-50' },
    REDEMPTION_SUCCESS: { icon: Gift, color: 'text-green-500', bg: 'bg-green-50' },
    REDEMPTION_AT_OUTLET: { icon: Gift, color: 'text-primary', bg: 'bg-red-50' },
    OUTLET_CREATED: { icon: Store, color: 'text-blue-500', bg: 'bg-blue-50' },
};

const getIconConfig = (type) => typeIcons[type] || { icon: Bell, color: 'text-gray-400', bg: 'bg-gray-50' };

const NotificationPopover = ({ isOpen, onClose, notifications = [], onMarkOneRead, onMarkAllRead }) => {
    if (!isOpen) return null;

    const hasUnread = notifications.some((n) => n.isUnread);

    return (
        <div className="absolute right-0 top-[56px] w-[440px] bg-white rounded-[20px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-[15px] font-bold text-dark">Notifications</h2>
                {hasUnread && (
                    <button
                        onClick={onMarkAllRead}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-[11px] font-bold text-gray-600 rounded-lg transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map((notif) => {
                        const { icon: Icon, color, bg } = getIconConfig(notif.type);
                        return (
                            <div
                                key={notif.id}
                                onClick={() => notif.isUnread && onMarkOneRead?.(notif.id)}
                                className={`flex items-start gap-3 px-6 py-4 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${
                                    notif.isUnread ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-full ${bg} shrink-0 flex items-center justify-center mt-0.5`}>
                                    <Icon size={16} className={color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-2">
                                        <p className={`text-[13px] leading-tight line-clamp-2 ${
                                            notif.isUnread ? 'font-bold text-dark' : 'font-medium text-gray-600'
                                        }`}>
                                            {notif.title}
                                        </p>
                                        {notif.isUnread && (
                                            <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />
                                        )}
                                    </div>
                                    {notif.message && (
                                        <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                    )}
                                    <p className="text-[11px] text-gray-400 mt-1">{notif.timestamp}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                            <Bell size={20} className="text-gray-300" />
                        </div>
                        <p className="text-[14px] font-semibold text-gray-300">No notifications yet</p>
                        <p className="text-[12px] text-gray-300 mt-1">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPopover;
