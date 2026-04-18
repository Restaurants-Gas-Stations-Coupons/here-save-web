const DEFAULT_BASE_URL = 'http://localhost:3000/api';
const TOAST_EVENT_NAME = 'app:toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;
let refreshPromise = null;

function getAuthToken() {
  return window.localStorage.getItem('accessToken');
}

function getRefreshToken() {
  return window.localStorage.getItem('refreshToken');
}

function clearTokens() {
  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');
}

function notifyError(message) {
  if (typeof window === 'undefined' || !message) return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT_NAME, {
    detail: { type: 'error', message },
  }));
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('Missing refresh token');

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(async (response) => {
        let json = null;
        try {
          json = await response.json();
        } catch {
          // ignore parse errors and fail below
        }

        if (!response.ok || !json || json.success === false) {
          throw new Error(
            (json && json.error && json.error.message) ||
            `Refresh failed with status ${response.status}`
          );
        }

        const nextAccess = json?.data?.accessToken;
        const nextRefresh = json?.data?.refreshToken;
        if (!nextAccess) {
          throw new Error('Refresh response missing access token');
        }

        window.localStorage.setItem('accessToken', nextAccess);
        if (nextRefresh) {
          window.localStorage.setItem('refreshToken', nextRefresh);
        }

        return nextAccess;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function request(path, { method = 'GET', body, token, headers = {}, _retry = false } = {}) {
  const url = `${API_BASE_URL}${path}`;

  const finalHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  if (body && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  const authToken = token || getAuthToken();
  if (authToken) {
    finalHeaders.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  let json;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok || json === null || json.success === false) {
    if (
      response.status === 401 &&
      !_retry &&
      !path.startsWith('/auth/') &&
      getRefreshToken()
    ) {
      try {
        const nextAccessToken = await refreshAccessToken();
        return request(path, {
          method,
          body,
          token: token ? nextAccessToken : undefined,
          headers,
          _retry: true,
        });
      } catch {
        clearTokens();
      }
    }

    const message =
      (json && json.error && json.error.message) ||
      `Request failed with status ${response.status}`;
    notifyError(message);
    const error = new Error(message);
    error.status = response.status;
    error.payload = json;
    throw error;
  }

  return json;
}

export function post(path, body, options = {}) {
  return request(path, { ...options, method: 'POST', body });
}

export function get(path, options = {}) {
  return request(path, { ...options, method: 'GET' });
}

export function patch(path, body, options = {}) {
  return request(path, { ...options, method: 'PATCH', body });
}

export function del(path, options = {}) {
  return request(path, { ...options, method: 'DELETE' });
}
