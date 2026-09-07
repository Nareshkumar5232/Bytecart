import { apiRequest } from './api';

const TOKEN_KEY = 'bytecart_auth_token_v1';
const USER_KEY = 'bytecart_auth_user_v1';

export const authService = {
  async login({ email, password }) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    if (data.token && data.user) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data;
  },

  async register({ name, email, password, phone }) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password, phone }
    });

    if (data.token && data.user) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data;
  },

  async getCurrentUser() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      const data = await apiRequest('/auth/me', { token });
      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
      return null;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  async updateProfile(profileData) {
    const data = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: profileData
    });
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data.user;
  },

  async changePassword({ currentPassword, newPassword }) {
    return await apiRequest('/auth/change-password', {
      method: 'PUT',
      body: { currentPassword, newPassword }
    });
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser() {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
};
