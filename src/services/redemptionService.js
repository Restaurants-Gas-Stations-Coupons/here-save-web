import { get } from './apiClient';

/** @returns {Promise<{ redemptions: object[], total_discount_amount: number, discount_currency?: string|null }>} */
export async function fetchRedemptions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await get(`/redemptions${queryString ? `?${queryString}` : ''}`, { token: window.localStorage.getItem('accessToken') });
    return response.data;
}
