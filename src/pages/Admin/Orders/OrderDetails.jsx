import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../../services/orderService';
import { adminService } from '../../../services/adminService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Save,
  AlertCircle
} from 'lucide-react';

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const { addToast } = useToast();

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await orderService.getOrderById(orderId);
      setOrder(res);
      setSelectedStatus(res.orderStatus || 'Confirmed');
      setSelectedPaymentStatus(res.paymentStatus || 'Pending (Pay on Delivery)');
    } catch (err) {
      console.error('Failed to load order', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      const updated = await adminService.updateOrderStatus(orderId, {
        orderStatus: selectedStatus,
        paymentStatus: selectedPaymentStatus,
      });
      setOrder(updated);
      addToast(`Order status updated to ${selectedStatus}.`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update order status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#24221F] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-serif text-[#77716A] uppercase tracking-wider">Loading Order Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 rounded-3xl bg-red-50 border border-red-200 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
        <p className="font-serif font-bold text-red-900">Order #{orderId} not found in database.</p>
        <Link to="/admin/orders" className="text-xs font-semibold text-[#A66A4C] hover:underline">
          ← Return to Orders List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DBD0] pb-6">
        <div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-[#A66A4C] hover:text-[#24221F] inline-flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders List</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#24221F] font-bold">
            Order #{order.id}
          </h1>
          <p className="text-xs text-[#77716A]">Placed on {formatDate(order.createdAt)}</p>
        </div>

        {/* Status Quick Updater */}
        <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-2xl border border-[#E2DBD0] shadow-xs">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider font-semibold text-[#77716A] block">
              Order Lifecycle Status
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#F5F2EC] border border-[#E2DBD0] text-xs font-semibold text-[#24221F]"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider font-semibold text-[#77716A] block">
              Payment State
            </span>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#F5F2EC] border border-[#E2DBD0] text-xs font-semibold text-[#24221F]"
            >
              <option value="Paid">Paid</option>
              <option value="Pending (Pay on Delivery)">Pending (Pay on Delivery)</option>
              <option value="Refunded">Refunded</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <button
            onClick={handleStatusUpdate}
            disabled={updating}
            className="self-end px-4 py-2 rounded-xl bg-[#24221F] hover:bg-[#A66A4C] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 cursor-pointer transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{updating ? 'Saving...' : 'Update Status'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Ordered Items & Shipping */}
        <div className="lg:col-span-7 space-y-6">
          {/* Items Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] space-y-6 shadow-xs">
            <h2 className="text-lg font-serif font-bold text-[#24221F]">
              Ordered Items ({order.items?.length || 0})
            </h2>

            <div className="divide-y divide-[#E2DBD0]">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-[#EAE4DA] shrink-0"
                    />
                    <div className="space-y-0.5 text-xs min-w-0">
                      <p className="font-serif font-bold text-[#24221F] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#77716A]">{item.categoryName || 'Hardware'}</p>
                      <p className="text-[11px] text-[#77716A]">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-sm text-[#24221F] shrink-0">
                    {formatCurrency(item.subtotal || item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A66A4C]">
              <MapPin className="w-4 h-4" />
              <span>Customer Delivery Destination</span>
            </div>
            <div className="text-xs space-y-1 text-[#77716A]">
              <p className="font-serif font-bold text-sm text-[#24221F]">{order.shippingAddress?.name}</p>
              <p className="leading-relaxed">
                {order.shippingAddress?.house}, {order.shippingAddress?.street}, {order.shippingAddress?.area}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
              </p>
              <p className="text-[#24221F] font-medium pt-1">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Price Breakdown & Payment Audit */}
        <div className="lg:col-span-5 space-y-6">
          {/* Price Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] space-y-6 shadow-xs">
            <h2 className="text-lg font-serif font-bold text-[#24221F]">Authoritative Price Calculation</h2>

            <div className="space-y-3 text-xs border-b border-[#E2DBD0] pb-4">
              <div className="flex justify-between text-[#77716A]">
                <span>Items Subtotal</span>
                <span className="font-serif font-bold text-[#24221F]">{formatCurrency(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-[#A66A4C]">
                  <span>Discount Applied</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#77716A]">
                <span>Delivery Charge</span>
                <span>{order.deliveryCharge > 0 ? formatCurrency(order.deliveryCharge) : 'Complimentary'}</span>
              </div>

              <div className="flex justify-between text-[#77716A]">
                <span>Tax / GST</span>
                <span>{order.tax > 0 ? formatCurrency(order.tax) : '₹0'}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline text-[#24221F]">
              <span className="font-serif font-bold text-base">Grand Total</span>
              <span className="font-serif font-bold text-2xl text-[#24221F]">{formatCurrency(order.total)}</span>
            </div>

            {/* Payment Summary Box */}
            <div className="p-4 rounded-2xl bg-[#F5F2EC] border border-[#E2DBD0] space-y-2 text-xs text-[#77716A]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#A66A4C]" />
                <span className="font-semibold text-[#24221F]">
                  {order.paymentMethod === 'ONLINE' ? 'Online Payment (Razorpay)' : 'Cash on Delivery (COD)'}
                </span>
              </div>
              <p className="text-[11px]">Payment Status: <strong className="text-[#24221F]">{order.paymentStatus}</strong></p>
              {order.transactionId && (
                <p className="text-[11px] text-[#77716A]">Transaction ID: <code className="text-[#24221F] font-mono">{order.transactionId}</code></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
