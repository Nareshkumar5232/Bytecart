import { apiRequest } from './api';

export const adminService = {
  // Dashboard stats
  async getDashboardStats() {
    return await apiRequest('/admin/dashboard');
  },

  // Orders
  async getOrders(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'ALL') query.set('status', params.status);
    if (params.paymentStatus && params.paymentStatus !== 'ALL') query.set('paymentStatus', params.paymentStatus);
    if (params.search) query.set('search', params.search);
    const qs = query.toString();
    return await apiRequest(qs ? `/admin/orders?${qs}` : '/admin/orders');
  },

  async updateOrderStatus(orderId, { orderStatus, paymentStatus }) {
    return await apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { orderStatus, paymentStatus }
    });
  },

  // Payments
  async getPayments() {
    return await apiRequest('/admin/payments');
  },

  // Products CRUD
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    const qs = query.toString();
    return await apiRequest(qs ? `/products?${qs}` : '/products');
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
    return await apiRequest('/categories');
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
