import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ArrowRight,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { addressService } from '../../services/addressService';
import { formatCurrency } from '../../utils/formatters';

export default function Account() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [recentOrders, setRecentOrders] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { redirect: '/account' }, replace: true });
      return;
    }

    async function loadAccountData() {
      if (!user) return;
      setLoading(true);
      try {
        const [ordersList, addressesList] = await Promise.all([
          orderService.getOrders(user.id),
          addressService.getAddresses(user.id),
        ]);
        setRecentOrders((ordersList || []).slice(0, 2));
        setDefaultAddress((addressesList || []).find((a) => a.isDefault) || addressesList?.[0] || null);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadAccountData();
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading || (loading && isAuthenticated)) {
    return (
      <div className="pt-36 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-pulse">
        <div className="h-20 bg-[#E8E0D5] rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-[#E8E0D5] rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DBD0] pb-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            Client Sanctuary
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#24221F] tracking-tight">
            Hello, {user?.name || 'Client'}
          </h1>
          <p className="text-xs text-[#77716A]">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-full border border-[#E2DBD0] text-[#77716A] hover:text-[#24221F] hover:border-[#24221F] text-xs font-semibold uppercase tracking-wider transition-colors self-start sm:self-auto cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Account Navigation Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/my-orders"
          className="p-6 rounded-3xl bg-[#E8E0D5]/40 hover:bg-[#E8E0D5]/80 border border-[#E2DBD0] transition-all space-y-3 block group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F4F0E8] text-[#24221F] flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-[#24221F] group-hover:text-[#A66A4C] transition-colors">
            My Orders
          </h3>
          <p className="text-xs text-[#77716A]">Track current dispatches and previous product orders.</p>
        </Link>

        <Link
          to="/account/addresses"
          className="p-6 rounded-3xl bg-[#E8E0D5]/40 hover:bg-[#E8E0D5]/80 border border-[#E2DBD0] transition-all space-y-3 block group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F4F0E8] text-[#24221F] flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-[#24221F] group-hover:text-[#A66A4C] transition-colors">
            Delivery Addresses
          </h3>
          <p className="text-xs text-[#77716A]">Manage saved residential and workplace destinations.</p>
        </Link>

        <Link
          to="/account/profile"
          className="p-6 rounded-3xl bg-[#E8E0D5]/40 hover:bg-[#E8E0D5]/80 border border-[#E2DBD0] transition-all space-y-3 block group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F4F0E8] text-[#24221F] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif text-[#24221F] group-hover:text-[#A66A4C] transition-colors">
            Profile & Security
          </h3>
          <p className="text-xs text-[#77716A]">Update personal details, contact number, and password.</p>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-serif text-[#24221F]">Recent Orders</h2>
          {recentOrders.length > 0 && (
            <Link
              to="/my-orders"
              className="text-xs font-semibold uppercase tracking-wider text-[#A66A4C] hover:text-[#24221F]"
            >
              View All ({recentOrders.length}) →
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#E8E0D5]/20 border border-[#E2DBD0] text-center text-xs text-[#77716A]">
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-[#E8E0D5]/30 border border-[#E2DBD0] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#24221F]">#{order.id}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#24221F] text-[#F4F0E8]">
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#77716A]">
                    {order.items?.length} {order.items?.length === 1 ? 'Item' : 'Items'} • {formatCurrency(order.total)}
                  </p>
                </div>

                <Link
                  to={`/my-orders/${order.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#A66A4C] hover:text-[#24221F]"
                >
                  <span>Order Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Default Address Snapshot */}
      <div className="space-y-3">
        <h2 className="text-xl font-serif text-[#24221F]">Delivery Address</h2>
        {defaultAddress ? (
          <div className="p-6 rounded-3xl bg-[#E8E0D5]/30 border border-[#E2DBD0] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A66A4C]">
                Default Delivery Destination
              </span>
              <Link
                to="/account/addresses"
                className="text-xs text-[#77716A] hover:text-[#24221F] underline"
              >
                Manage
              </Link>
            </div>
            <p className="font-serif font-bold text-sm text-[#24221F]">{defaultAddress.name} ({defaultAddress.tag})</p>
            <p className="text-xs text-[#77716A]">
              {defaultAddress.house}, {defaultAddress.street}, {defaultAddress.area}, {defaultAddress.city} – {defaultAddress.pincode}
            </p>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-[#E8E0D5]/20 border border-[#E2DBD0] text-center space-y-3">
            <p className="text-xs text-[#77716A]">No saved addresses.</p>
            <Link
              to="/account/addresses"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#24221F] text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-[#A66A4C] transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Address</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
