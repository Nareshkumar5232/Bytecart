/**
 * Payment Service Abstraction Layer
 * Interfaces with backend payment endpoints (/api/payments/create-order, /api/payments/verify).
 * Never stores secret keys on frontend.
 */
export const paymentService = {
  async initializePaymentSession({ amount, customerEmail, customerPhone, customerName }) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    // Ready to integrate with backend payment session endpoint:
    return {
      sessionId: 'BC_PAY_' + Date.now(),
      amount,
      currency: 'INR',
      customer: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
    };
  },

  async verifyPaymentSignature({ paymentId, orderId, signature }) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    // When backend endpoint is connected:
    // const res = await fetch('/api/payments/verify', { method: 'POST', body: ... });
    return {
      verified: true,
      transactionId: paymentId || 'TXN_' + Date.now(),
      status: 'Captured',
    };
  },
};
