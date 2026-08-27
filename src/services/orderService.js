const ORDERS_STORAGE_KEY = 'bytecart_customer_orders_v1';

export const orderService = {
  async getOrders(userId) {
    await new Promise((resolve) => setTimeout(resolve, 60));
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      let orders = stored ? JSON.parse(stored) : [];
      if (userId) {
        return orders.filter((o) => o.userId === userId);
      }
      return orders;
    } catch {
      return [];
    }
  },

  async getOrderById(orderId) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const orders = await this.getOrders();
    return orders.find((o) => o.id === orderId || o.id === '#' + orderId) || null;
  },

  async createOrder({
    userId,
    items,
    shippingAddress,
    subtotal,
    deliveryCharge = 0,
    discount = 0,
    tax = 0,
    total,
    paymentMethod,
    paymentStatus = 'Pending',
    transactionId = null,
  }) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const orders = await this.getOrders();

    const orderNumber = 'BC' + Math.floor(10000 + Math.random() * 90000);
    const now = new Date().toISOString();

    const newOrder = {
      id: orderNumber,
      userId: userId || 'usr-guest',
      items: items.map((i) => ({
        id: i.product?.id,
        name: i.product?.name,
        slug: i.product?.slug,
        categoryName: i.product?.categoryName,
        price: i.product?.price,
        quantity: i.quantity,
        image: i.product?.images?.[0] || '',
        material: i.product?.material || '',
        dimensions: i.product?.dimensions || '',
        subtotal: (i.product?.price || 0) * i.quantity,
      })),
      shippingAddress,
      subtotal,
      deliveryCharge,
      discount,
      tax,
      total,
      paymentMethod,
      paymentProvider: paymentMethod === 'ONLINE' ? 'Payment Gateway' : 'Cash on Delivery',
      paymentStatus: paymentMethod === 'ONLINE' ? 'Paid' : 'Pending (Pay on Delivery)',
      transactionId: transactionId || (paymentMethod === 'ONLINE' ? 'TXN_BC_' + Date.now() : null),
      orderStatus: 'Confirmed',
      timeline: [
        { status: 'Order Placed', date: now, done: true, current: false },
        { status: 'Confirmed', date: now, done: true, current: true },
        { status: 'Processing', date: null, done: false, current: false },
        { status: 'Packed', date: null, done: false, current: false },
        { status: 'Shipped', date: null, done: false, current: false },
        { status: 'Out for Delivery', date: null, done: false, current: false },
        { status: 'Delivered', date: null, done: false, current: false },
      ],
      createdAt: now,
      updatedAt: now,
    };

    orders.unshift(newOrder);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    return newOrder;
  },

  async cancelOrder(orderId, reason = 'Customer request') {
    await new Promise((resolve) => setTimeout(resolve, 150));
    let orders = await this.getOrders();
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      throw new Error('Order not found.');
    }

    const cancellableStatuses = ['Pending', 'Confirmed', 'Processing'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      throw new Error(`Order cannot be cancelled because it is already ${order.orderStatus}.`);
    }

    orders = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: 'Cancelled',
          cancellationReason: reason,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });

    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    return orders.find((o) => o.id === orderId);
  },

  isCancellable(status) {
    return ['Pending', 'Confirmed', 'Processing'].includes(status);
  },
};
