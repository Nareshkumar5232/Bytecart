import { apiRequest } from './api';

export const paymentService = {
  async initializePaymentSession({ amount, customerEmail, customerPhone, customerName }) {
    return await apiRequest('/payments/create-order', {
      method: 'POST',
      body: { amount, customerEmail, customerPhone, customerName }
    });
  },

  async verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    return await apiRequest('/payments/verify', {
      method: 'POST',
      body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    });
  }
};
