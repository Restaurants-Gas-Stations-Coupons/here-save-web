import { get, patch } from './apiClient';

export async function fetchNotifications(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const response = await get(`/notifications${qs ? `?${qs}` : ''}`);
    return response.data;
}

export async function fetchUnreadCount() {
    const response = await get('/notifications/unread-count');
    return response.data?.count ?? 0;
}

export async function markNotificationRead(id) {
    const response = await patch(`/notifications/${id}/read`, {});
    return response.data;
}

export async function markAllNotificationsRead() {
    const response = await patch('/notifications/read-all', {});
    return response.data;
}
