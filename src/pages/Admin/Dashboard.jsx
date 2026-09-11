import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ShoppingBag,
  CreditCard,
  Layers,
  Users,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminService.getDashboardStats();
      setData(res);
    } catch (err) {
      setError(err.message || 'Unable to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#24221F] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-serif text-[#77716A] uppercase tracking-wider">Loading Real-Time Database Metrics...</p>
      </div>
    );
  }



  const kpis = data?.kpis || {
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
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(kpis.totalRevenue),
      subtitle: 'Realized from active orders',
      icon: TrendingUp,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Total Orders',
      value: kpis.totalOrders,
      subtitle: `${kpis.pendingOrders} pending · ${kpis.completedOrders} completed`,
      icon: ShoppingBag,
      color: 'text-[#24221F]',
      bgColor: 'bg-[#EAE4DA]/50 border-[#E2DBD0]'
    },
    {
      title: 'Total Products',
      value: kpis.totalProducts,
      subtitle: `${kpis.lowStockProducts} items low on stock`,
      icon: Layers,
      color: 'text-[#A66A4C]',
      bgColor: 'bg-[#EAE4DA]/50 border-[#E2DBD0]'
    },
    {
      title: 'Registered Customers',
      value: kpis.totalCustomers,
      subtitle: 'Active user accounts',
      icon: Users,
      color: 'text-indigo-800',
      bgColor: 'bg-indigo-50 border-indigo-200'
    },
    {
      title: 'Unread Feedback',
      value: kpis.unreadFeedback,
      subtitle: 'Contact & support messages',
      icon: MessageSquare,
      color: kpis.unreadFeedback > 0 ? 'text-amber-700' : 'text-[#77716A]',
      bgColor: kpis.unreadFeedback > 0 ? 'bg-amber-50 border-amber-200' : 'bg-[#EAE4DA]/50 border-[#E2DBD0]'
    },
    {
      title: 'Payment Status',
      value: `${kpis.successfulPayments} Paid`,
      subtitle: `${kpis.pendingPayments} pending verification`,
      icon: CreditCard,
      color: 'text-teal-800',
      bgColor: 'bg-teal-50 border-teal-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Non-blocking Connection Notice if operating in offline/fallback mode */}
      {(data?._isFallback || error) && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Database Operating in Offline/Local Mode:</span>{' '}
              <span className="text-amber-800">
                {error || data?._notice || 'Live database currently unreachable; displaying local metrics.'}
              </span>
            </div>
          </div>
          <button
            onClick={fetchStats}
            className="px-3 py-1.5 rounded-full bg-[#24221F] text-white text-[11px] font-semibold tracking-wider uppercase hover:bg-[#A66A4C] cursor-pointer shrink-0 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            Operational Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#24221F] font-bold">
            Administrative Dashboard
          </h1>
        </div>

        <button
          onClick={fetchStats}
          className="self-start sm:self-auto px-4 py-2 rounded-full border border-[#E2DBD0] bg-white hover:bg-[#EAE4DA] text-xs font-semibold text-[#24221F] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#77716A]" />
          <span>Refresh Database Stats</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-3xl border ${card.bgColor} space-y-3 transition-transform hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#77716A]">
                  {card.title}
                </span>
                <div className="p-2 rounded-xl bg-white/80">
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-serif font-bold ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-[11px] text-[#77716A] mt-1">{card.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#EAE4DA]/30 rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#24221F]">Recent Orders</h2>
            <p className="text-xs text-[#77716A]">Directly synchronized with customer checkout pipeline</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-[#A66A4C] hover:text-[#24221F] flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!data?.recentOrders || data.recentOrders.length === 0) ? (
          <div className="py-12 text-center space-y-2 border border-dashed border-[#E2DBD0] rounded-2xl bg-white/40">
            <ShoppingBag className="w-8 h-8 text-[#9E9890] mx-auto" />
            <p className="text-sm font-serif text-[#24221F]">No orders have been placed yet.</p>
            <p className="text-xs text-[#77716A]">Orders placed on the customer store will appear here in real-time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2DBD0] text-[#77716A] uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Payment</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DBD0]">
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/60 transition-colors">
                    <td className="py-3.5 font-serif font-bold text-[#24221F]">{order.id}</td>
                    <td className="py-3.5 font-medium text-[#24221F]">
                      {order.customerName}
                      <span className="block text-[10px] text-[#77716A]">{order.customerEmail}</span>
                    </td>
                    <td className="py-3.5 text-[#77716A]">{formatDate(order.createdAt)}</td>
                    <td className="py-3.5 text-[#77716A]">{order.items?.length || 0} items</td>
                    <td className="py-3.5 font-serif font-bold text-[#24221F]">{formatCurrency(order.total)}</td>
                    <td className="py-3.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        order.paymentStatus === 'Paid' || order.paymentStatus === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="px-3 py-1 rounded-full bg-[#24221F] text-white text-[10px] font-semibold uppercase hover:bg-[#A66A4C] transition-colors"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
