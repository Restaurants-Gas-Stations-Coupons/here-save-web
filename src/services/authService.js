import { post, get } from './apiClient';

/** API envelope is `{ success, data }`; tolerate a bare object in tests or proxies. */
function unwrapData(json) {
  if (json == null) return null;
  if (typeof json === 'object' && 'data' in json && json.data !== undefined) {
    return json.data;
  }
  return json;
}

export async function loginWithPhone(idToken) {
  const json = await post('/auth/phone/login', { id_token: idToken });
  const data = unwrapData(json);
  return data && typeof data === 'object' ? data : {};
}

export async function fetchCurrentUser(accessToken) {
  const json = await get('/users/me', { token: accessToken });
  const data = unwrapData(json);
  return data;
}

