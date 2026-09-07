const API_BASE = '/api';

export async function apiRequest(endpoint, { method = 'GET', body, headers = {}, token } = {}) {
  const finalToken = token || localStorage.getItem('bytecart_auth_token_v1');
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (finalToken) {
    finalHeaders['Authorization'] = `Bearer ${finalToken}`;
  }

  const config = {
    method,
    headers: finalHeaders,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error || data?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`API Request error [${method} ${endpoint}]:`, err);
    throw err;
  }
}
