import { apiRequest } from './api';

export const orderService = {
  async calculateTotals({ items, promoCode }) {
    return await apiRequest('/orders/calculate', {
      method: 'POST',
      body: { items, promoCode }
    });
  },

  async createOrder({ items, shippingAddress, paymentMethod = 'COD', promoCode, transactionId, notes }) {
    return await apiRequest('/orders', {
      method: 'POST',
      body: {
        items,
        shippingAddress,
        paymentMethod,
        promoCode,
        transactionId,
        notes
      }
    });
  },

  async getMyOrders() {
    return await apiRequest('/orders/my-orders');
  },

  async getOrderById(id) {
    return await apiRequest(`/orders/${id}`);
  },

  async cancelOrder(id, reason = 'Customer request') {
    return await apiRequest(`/orders/${id}/cancel`, {
      method: 'PATCH',
      body: { reason }
    });
  },

  isCancellable(status) {
    return ['Pending', 'Confirmed', 'Processing', 'PLACED', 'CONFIRMED', 'PROCESSING'].includes(status);
  }
};
