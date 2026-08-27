import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight, ChevronRight } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export default function MyOrders() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { redirect: '/my-orders' }, replace: true });
      return;
    }

    async function loadOrders() {
      if (!user) return;
      setLoading(true);
      try {
        const list = await orderService.getOrders(user.id);
        setOrders(list || []);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadOrders();
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'Processing':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Packed':
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-[#E8E0D5] text-[#24221F] border-[#E2DBD0]';
    }
  };

  if (authLoading || (loading && isAuthenticated)) {
    return (
      <div className="pt-36 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="h-44 bg-[#E8E0D5] rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-2 border-b border-[#E2DBD0] pb-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
          Customer Account
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#24221F] tracking-tight">
          My Orders
        </h1>
        <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed font-light">
          Track fulfillment status, view invoices, and inspect dispatch timelines for your furniture pieces.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-24 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#E8E0D5] text-[#77716A] mx-auto flex items-center justify-center">
            <Package className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-2xl font-serif text-[#24221F]">You haven't placed any orders yet.</h3>
          <p className="text-xs text-[#77716A] leading-relaxed font-light">
            When you place an order for our handcrafted furniture, your receipt and live tracking will appear here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#24221F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#A66A4C] transition-colors"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#E8E0D5]/30 rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] space-y-6 hover:border-[#77716A] transition-all"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DBD0]">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-lg text-[#24221F]">
                      Order #{order.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#77716A]">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-baseline sm:items-end justify-between sm:flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-[#77716A]">Total Amount</span>
                  <span className="font-serif font-bold text-base sm:text-lg text-[#24221F]">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 pr-4 border-r border-[#E2DBD0]/60 last:border-none shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover bg-white"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-[#E8E0D5] flex items-center justify-center text-[#77716A]">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                      <div className="text-xs">
                        <p className="font-serif font-bold text-[#24221F] truncate max-w-[160px]">{item.name}</p>
                        <p className="text-[11px] text-[#77716A]">Qty: {item.quantity} • {formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View Details Button */}
                <Link
                  to={`/my-orders/${order.id}`}
                  className="px-6 py-2.5 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-[#F4F0E8] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>View Details & Tracking</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
