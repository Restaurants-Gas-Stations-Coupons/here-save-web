import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Search, Bell } from 'lucide-react';
import ProfilePopover from './ProfilePopover';
import NotificationPopover from './NotificationPopover';
import { fetchNotifications, fetchUnreadCount, markNotificationRead, markAllNotificationsRead } from '../../services/notificationService';

const mapNotification = (n) => ({
    id: n.id,
    title: n.title || 'New notification',
    message: n.message || '',
    type: n.type || '',
    timestamp: n.created_at
        ? new Date(n.created_at).toLocaleString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
        })
        : '',
    isUnread: !n.is_read,
    metadata: n.metadata || null,
});

const getInitials = (name) => {
    const n = (name || '').trim();
    if (!n) return 'U';
    const parts = n.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() || '').join('') || 'U';
};

const TopBar = ({
    title,
    role,
    currentUser,
    onAddStation,
    navItems = [],
    activeNav,
    onNavChange,
    searchValue = '',
    onSearchChange,
    searchPlaceholder = 'Search for something',
    showSearch = true,
    onLogout,
}) => {
    const validNavItems = Array.isArray(navItems)
        ? navItems.filter((item) => item?.id && !item?.hidden)
        : [];
    const currentNavIndex = validNavItems.findIndex((item) => item.id === activeNav);
    const canGoPrev = validNavItems.length > 1 && currentNavIndex > 0;
    const canGoNext = validNavItems.length > 1 && currentNavIndex >= 0 && currentNavIndex < validNavItems.length - 1;

    const goToNavByIndex = (index) => {
        const target = validNavItems[index];
        if (target?.id && onNavChange) onNavChange(target.id);
    };

    const [showProfile, setShowProfile] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    const loadNotifications = useCallback(async () => {
        try {
            const [data, count] = await Promise.all([
                fetchNotifications({ limit: 30 }),
                fetchUnreadCount(),
            ]);
            const list = Array.isArray(data) ? data : [];
            setNotifications(list.map(mapNotification));
            setUnreadCount(typeof count === 'number' ? count : 0);
        } catch {
            // silently ignore
        }
    }, []);

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, [loadNotifications]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotif(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const handleMarkOneRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
            );
            setUnreadCount((c) => Math.max(0, c - 1));
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark notifications as read', err);
        }
    };

    return (
        <header className="h-[72px] flex items-center px-10 gap-4 shrink-0 bg-[#F3F7FA] relative z-40">
            {/* Back / fwd */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => canGoPrev && goToNavByIndex(currentNavIndex - 1)}
                    disabled={!canGoPrev}
                    className={`p-1.5 rounded-lg transition-all ${canGoPrev
                        ? 'hover:bg-white text-[#BBBBBB] hover:text-dark'
                        : 'text-[#D4D9DF] cursor-not-allowed'
                        }`}
                    aria-label="Go back"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={() => canGoNext && goToNavByIndex(currentNavIndex + 1)}
                    disabled={!canGoNext}
                    className={`p-1.5 rounded-lg transition-all ${canGoNext
                        ? 'hover:bg-white text-dark'
                        : 'text-[#D4D9DF] cursor-not-allowed'
                        }`}
                    aria-label="Go forward"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <h1 className="text-[15px] font-semibold text-dark ml-4">{title}</h1>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search */}
            {showSearch && (
                <div className="flex items-center gap-3 bg-white rounded-[16px] px-5 py-3.5 w-[380px] shadow-sm">
                    <Search size={18} className="text-[#999999] shrink-0" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="flex-1 text-[15px] bg-transparent outline-none placeholder:text-[#999999] text-dark font-medium"
                    />
                </div>
            )}

            {/* Notifications */}
            <div ref={notifRef} className="relative">
                <button
                    onClick={() => {
                        setShowNotif(!showNotif);
                        setShowProfile(false);
                    }}
                    className={`relative p-3 rounded-full transition-all ${showNotif ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                >
                    <Bell size={22} className="text-dark" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2 w-[18px] h-[18px] bg-primary rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                <NotificationPopover
                    isOpen={showNotif}
                    onClose={() => setShowNotif(false)}
                    notifications={notifications}
                    onMarkOneRead={handleMarkOneRead}
                    onMarkAllRead={handleMarkAllRead}
                />
            </div>

            {/* Avatar Row */}
            <div ref={profileRef} className="relative">
                <button
                    onClick={() => {
                        setShowProfile(!showProfile);
                        setShowNotif(false);
                    }}
                    className={`flex items-center p-0.5 rounded-full transition-all ${showProfile ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                >
                    <div className="w-[42px] h-[42px] rounded-full shrink-0 shadow-sm border border-white bg-[#F3F7FA] flex items-center justify-center text-[13px] font-bold text-primary">
                        {getInitials(currentUser?.full_name)}
                    </div>
                </button>

                <ProfilePopover
                    isOpen={showProfile}
                    onClose={() => setShowProfile(false)}
                    user={currentUser}
                    onLogout={onLogout}
                />
            </div>
        </header>
    );
};

export default TopBar;
