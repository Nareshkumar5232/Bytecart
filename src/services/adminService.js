import { apiRequest } from './api';
import { categoriesData } from '../data/categoriesData';

export const adminService = {
  // Dashboard stats
  async getDashboardStats() {
    try {
      const res = await apiRequest('/admin/dashboard');
      return res;
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          const res = await apiRequest('/admin/dashboard/stats');
          return {
            kpis: {
              totalOrders: res.totalOrders ?? res.kpis?.totalOrders ?? 0,
              pendingOrders: res.pendingOrders ?? res.kpis?.pendingOrders ?? 0,
              completedOrders: res.completedOrders ?? res.kpis?.completedOrders ?? 0,
              cancelledOrders: res.cancelledOrders ?? res.kpis?.cancelledOrders ?? 0,
              totalRevenue: res.totalRevenue ?? res.kpis?.totalRevenue ?? 0,
              pendingPayments: res.pendingPayments ?? res.kpis?.pendingPayments ?? 0,
              successfulPayments: res.successfulPayments ?? res.kpis?.successfulPayments ?? 0,
              failedPayments: res.failedPayments ?? res.kpis?.failedPayments ?? 0,
              totalProducts: res.totalProducts ?? res.kpis?.totalProducts ?? 0,
              lowStockProducts: res.lowStockProducts ?? res.kpis?.lowStockProducts ?? 0,
              totalCustomers: res.totalCustomers ?? res.kpis?.totalCustomers ?? 0,
              unreadFeedback: res.unreadFeedback ?? res.kpis?.unreadFeedback ?? 0,
            },
            recentOrders: res.recentOrders || [],
            settings: res.settings || {},
          };
        } catch (innerErr) {
          console.warn('Dashboard stats fallback endpoint failed:', innerErr);
        }
      }
      // Return safe fallback metrics rather than breaking the admin dashboard
      return {
        kpis: {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
          totalRevenue: 0,
          pendingPayments: 0,
          successfulPayments: 0,
          failedPayments: 0,
          totalProducts: 0,
          lowStockProducts: 0,
          totalCustomers: 0,
          unreadFeedback: 0,
        },
        recentOrders: [],
        settings: {},
        _isFallback: true,
        _notice: err.message || 'Database connection currently operating in local mode',
      };
    }
  },

  // Orders
  async getOrders(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.status && params.status !== 'ALL') query.set('status', params.status);
      if (params.paymentStatus && params.paymentStatus !== 'ALL') query.set('paymentStatus', params.paymentStatus);
      if (params.search) query.set('search', params.search);
      const qs = query.toString();
      const res = await apiRequest(qs ? `/admin/orders?${qs}` : '/admin/orders');
      return Array.isArray(res) ? res : (res?.orders || []);
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          const res = await apiRequest('/order');
          return Array.isArray(res) ? res : (res?.orders || []);
        } catch {
          return [];
        }
      }
      return [];
    }
  },

  async updateOrderStatus(orderId, { orderStatus, paymentStatus }) {
    return await apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { orderStatus, paymentStatus }
    });
  },

  // Payments
  async getPayments() {
    try {
      const res = await apiRequest('/admin/payments');
      return Array.isArray(res) ? res : (res?.payments || []);
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          const res = await apiRequest('/payment');
          return Array.isArray(res) ? res : [];
        } catch {
          return [];
        }
      }
      return [];
    }
  },

  // Products CRUD
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') query.set('category', params.category);
      if (params.search) query.set('search', params.search);
      const qs = query.toString();
      const res = await apiRequest(qs ? `/products?${qs}` : '/products');
      return Array.isArray(res) ? res : (res?.products || []);
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          const res = await apiRequest('/product');
          return Array.isArray(res) ? res : (res?.products || []);
        } catch {
          return [];
        }
      }
      return [];
    }
  },

  async createProduct(productData) {
    return await apiRequest('/products', {
      method: 'POST',
      body: productData
    });
  },

  async updateProduct(id, productData) {
    return await apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: productData
    });
  },

  async deleteProduct(id) {
    return await apiRequest(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Categories CRUD
  async getCategories() {
    try {
      const res = await apiRequest('/categories');
      return Array.isArray(res) ? res : (res?.categories || []);
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          const res = await apiRequest('/admin/categories');
          return Array.isArray(res) ? res : (res?.categories || []);
        } catch {
          return categoriesData || [];
        }
      }
      return categoriesData || [];
    }
  },

  async createCategory(categoryData) {
    return await apiRequest('/categories', {
      method: 'POST',
      body: categoryData
    });
  },

  async updateCategory(id, categoryData) {
    return await apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: categoryData
    });
  },

  async deleteCategory(id) {
    return await apiRequest(`/categories/${id}`, {
      method: 'DELETE'
    });
  },

  // Brands CRUD
  async getBrands() {
    return await apiRequest('/admin/brands');
  },

  async createBrand(brandData) {
    return await apiRequest('/admin/brands', {
      method: 'POST',
      body: brandData
    });
  },

  async deleteBrand(id) {
    return await apiRequest(`/admin/brands/${id}`, {
      method: 'DELETE'
    });
  },

  // Inventory
  async getInventory() {
    return await apiRequest('/admin/inventory');
  },

  async updateInventory(productId, { stock, inStock }) {
    return await apiRequest(`/admin/inventory/${productId}`, {
      method: 'PUT',
      body: { stock, inStock }
    });
  },

  // Customers
  async getCustomers() {
    return await apiRequest('/admin/customers');
  },

  async getCustomerDetails(id) {
    return await apiRequest(`/admin/customers/${id}`);
  },

  // Feedback
  async getFeedback() {
    return await apiRequest('/admin/feedback');
  },

  async updateFeedbackStatus(id, { read }) {
    return await apiRequest(`/admin/feedback/${id}/status`, {
      method: 'PATCH',
      body: { read }
    });
  },

  async deleteFeedback(id) {
    return await apiRequest(`/admin/feedback/${id}`, {
      method: 'DELETE'
    });
  },

  // Settings
  async getSettings() {
    return await apiRequest('/admin/settings');
  },

  async updateSettings(settingsData) {
    return await apiRequest('/admin/settings', {
      method: 'PUT',
      body: settingsData
    });
  },

  // Audit Logs
  async getAuditLogs() {
    return await apiRequest('/admin/audit-logs');
  }
};
