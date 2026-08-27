const AUTH_STORAGE_KEY = 'bytecart_auth_user_v1';
const USERS_STORAGE_KEY = 'bytecart_registered_users_v1';

export const authService = {
  async getCurrentUser() {
    await new Promise((resolve) => setTimeout(resolve, 30));
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch {
      return null;
    }
  },

  async login(email, password) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const trimmedEmail = email.trim().toLowerCase();

    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    } catch {
      users = [];
    }

    const foundUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!foundUser || (foundUser.password && foundUser.password !== password)) {
      throw new Error('Invalid email or password.');
    }

    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      phone: foundUser.phone || '',
      createdAt: foundUser.createdAt || new Date().toISOString(),
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  async register({ name, email, phone, password }) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const trimmedEmail = email.trim().toLowerCase();

    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    } catch {
      users = [];
    }

    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: trimmedEmail,
      phone: phone.trim(),
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      createdAt: newUser.createdAt,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  async logout() {
    await new Promise((resolve) => setTimeout(resolve, 30));
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return true;
  },

  async updateProfile({ name, email, phone, newPassword }) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const current = await this.getCurrentUser();
    if (!current) throw new Error('Not authenticated.');

    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    } catch {
      users = [];
    }

    const updatedUser = {
      ...current,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
    };

    users = users.map((u) => {
      if (u.id === current.id) {
        return {
          ...u,
          ...updatedUser,
          password: newPassword ? newPassword : u.password,
        };
      }
      return u;
    });

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  async requestPasswordReset(email) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return { success: true, message: 'Password reset link sent to ' + email };
  },
};
