import { post, get } from './apiClient';

export async function loginWithPhone(idToken) {
  const response = await post('/auth/phone/login', { id_token: idToken });
  return response.data;
}

export async function fetchCurrentUser(accessToken) {
  const response = await get('/users/me', { token: accessToken });
  return response.data;
}

