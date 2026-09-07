import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  AlertTriangle,
  XCircle,
  X
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

const TIMELINE_STEPS = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changed mind regarding product selection');
  const [cancelling, setCancelling] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const found = await orderService.getOrderById(orderId);
        setOrder(found);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const updated = await orderService.cancelOrder(order.id, cancelReason);
      setOrder(updated);
      setCancelModalOpen(false);
      addToast(`Order #${order.id} has been cancelled.`, 'info');
    } catch (err) {
      addToast(err.message || 'Could not cancel order.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-36 pb-28 max-w-md mx-auto px-4 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#24221F] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#77716A] font-serif">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-36 pb-28 max-w-md mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-serif text-[#24221F]">Order Not Found</h2>
        <p className="text-xs text-[#77716A]">We couldn’t locate order reference #{orderId}.</p>
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#24221F] text-white text-xs font-semibold uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>
      </div>
    );
  }

  const isCancellable = orderService.isCancellable(order.orderStatus);

  // Compute active step index for timeline
  const activeStepIndex = order.orderStatus === 'Cancelled'
    ? -1
    : TIMELINE_STEPS.indexOf(order.orderStatus) !== -1
    ? TIMELINE_STEPS.indexOf(order.orderStatus)
    : 1;

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DBD0] pb-6">
        <div>
          <Link
            to="/my-orders"
            className="text-xs font-semibold uppercase tracking-wider text-[#77716A] hover:text-[#24221F] inline-flex items-center gap-1 mb-2"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>All Orders</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#24221F] tracking-tight">
            Order #{order.id}
          </h1>
          <p className="text-xs text-[#77716A] mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {isCancellable && (
          <button
            onClick={() => setCancelModalOpen(true)}
            className="px-5 py-2.5 rounded-full border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold uppercase tracking-wider transition-colors self-start sm:self-auto cursor-pointer"
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* VISUAL ORDER STATUS TIMELINE */}
      <div className="bg-[#EAE4DA]/40 rounded-3xl p-8 sm:p-10 border border-[#E2DBD0] space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            Live Dispatch Progress
          </span>
          <span className="text-xs font-serif font-bold text-[#24221F]">
            Status: {order.orderStatus}
          </span>
        </div>

        {order.orderStatus === 'Cancelled' ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs text-red-800">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="font-bold">This order has been cancelled.</p>
              <p className="text-red-600">{order.cancellationReason || 'Cancelled by customer.'}</p>
            </div>
          </div>
        ) : (
          <div className="pt-2 overflow-x-auto pb-4">
            <div className="flex items-center justify-between min-w-[620px] relative">
              {/* Timeline bar */}
              <div className="absolute top-3.5 left-6 right-6 h-[2px] bg-[#E2DBD0] -z-0" />

              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx < activeStepIndex;
                const isCurrent = idx === activeStepIndex;

                return (
                  <div key={step} className="flex flex-col items-center relative z-10 space-y-2 text-center w-24">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-[#24221F] text-white'
                          : isCurrent
                          ? 'bg-[#A66A4C] text-white ring-4 ring-[#A66A4C]/20 animate-pulse'
                          : 'bg-[#EAE4DA] text-[#9E9890] border border-[#E2DBD0]'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] uppercase tracking-wider ${
                        isCurrent
                          ? 'font-bold text-[#24221F]'
                          : isPassed
                          ? 'text-[#24221F]'
                          : 'text-[#9E9890]'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Ordered Products & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Products List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#EAE4DA]/30 rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] space-y-6">
            <h3 className="text-lg font-serif text-[#24221F]">
              Ordered Products ({order.items?.length})
            </h3>

            <div className="divide-y divide-[#E2DBD0]">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-white"
                    />
                    <div className="space-y-0.5 text-xs">
                      <Link
                        to={`/products/${item.slug}`}
                        className="font-serif font-bold text-[#24221F] hover:text-[#A66A4C] transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[11px] text-[#77716A]">{item.material?.split('&')[0]}</p>
                      <p className="text-[11px] text-[#77716A]">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                  </div>

                  <span className="font-serif font-bold text-sm text-[#24221F]">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="bg-[#EAE4DA]/30 rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A66A4C]">
              <MapPin className="w-4 h-4" />
              <span>Delivery Address</span>
            </div>

            <div className="text-xs space-y-1 text-[#77716A]">
              <p className="font-serif font-bold text-sm text-[#24221F]">{order.shippingAddress?.name}</p>
              <p className="leading-relaxed">
                {order.shippingAddress?.house}, {order.shippingAddress?.street}, {order.shippingAddress?.area}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}
              </p>
              <p className="text-[#24221F] font-medium pt-1">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Price & Payment Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#EAE4DA]/40 rounded-3xl p-8 border border-[#E2DBD0] space-y-6">
            <h3 className="text-lg font-serif text-[#24221F]">Price Breakdown</h3>

            <div className="space-y-3 text-xs border-b border-[#E2DBD0] pb-4">
              <div className="flex justify-between text-[#77716A]">
                <span>Items Subtotal</span>
                <span className="font-serif font-bold text-[#24221F]">{formatCurrency(order.subtotal)}</span>
              </div>

              <div className="flex justify-between text-[#77716A]">
                <span>Delivery & Assembly</span>
                <span className="text-[#A66A4C] font-semibold">Complimentary</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-[#A66A4C]">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#77716A]">
                <span>Tax / GST</span>
                <span>{order.tax > 0 ? formatCurrency(order.tax) : '₹0'}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline text-[#24221F]">
              <span className="font-serif font-bold text-base">Total Paid</span>
              <span className="font-serif font-bold text-xl">{formatCurrency(order.total)}</span>
            </div>

            {/* Payment Summary */}
            <div className="pt-2 border-t border-[#E2DBD0] space-y-2 text-xs text-[#77716A]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-[#A66A4C]" />
                <span className="font-semibold text-[#24221F]">
                  {order.paymentMethod === 'ONLINE' ? 'Online Payment (Prepaid)' : 'Cash on Delivery'}
                </span>
              </div>
              <p className="text-[11px]">Payment Status: <strong className="text-[#24221F]">{order.paymentStatus}</strong></p>
              {order.transactionId && (
                <p className="text-[11px] text-[#9E9890]">Transaction ID: {order.transactionId}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#24221F]/60 backdrop-blur-xs"
            onClick={() => setCancelModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#F5F2EC] rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] shadow-2xl z-10 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">Confirm Cancellation</span>
                <h3 className="text-xl font-serif text-[#24221F] mt-1">Cancel Order #{order.id}?</h3>
              </div>
              <button onClick={() => setCancelModalOpen(false)} className="p-1 text-[#77716A] hover:text-[#24221F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#77716A] leading-relaxed">
              Once cancelled, this product packaging and dispatch schedule will be stopped. Any online payments made will be reversed to the original payment source.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#77716A]">Reason for cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#EAE4DA]/60 border border-[#E2DBD0] text-xs text-[#24221F]"
              >
                <option value="Changed mind regarding product selection">Changed mind regarding product selection</option>
                <option value="Ordered incorrect specifications / model">Ordered incorrect specifications / model</option>
                <option value="Found alternative product">Found alternative product</option>
                <option value="Delivery timeframe adjustment needed">Delivery timeframe adjustment needed</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-5 py-2.5 rounded-full border border-[#E2DBD0] text-xs font-semibold uppercase tracking-wider text-[#77716A] hover:text-[#24221F]"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-6 py-2.5 rounded-full bg-red-700 hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
