import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../../../services/adminService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { ArrowLeft, User, ShoppingBag } from 'lucide-react';

export default function AdminCustomerDetails() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await adminService.getCustomerDetails(userId);
        setData(res);
      } catch (err) {
        console.error('Failed to load customer', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#24221F] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-serif text-[#77716A] uppercase tracking-wider">Loading Customer Profile...</p>
      </div>
    );
  }

  const customer = data?.customer;
  const orders = data?.orders || [];

  return (
    <div className="space-y-6">
      <Link
        to="/admin/customers"
        className="text-xs font-semibold text-[#A66A4C] hover:text-[#24221F] inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Customer Directory</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] space-y-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EAE4DA] flex items-center justify-center text-[#24221F] font-serif font-bold text-xl">
            {customer?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#24221F]">{customer?.name}</h1>
            <p className="text-xs text-[#77716A]">{customer?.email} · Joined {formatDate(customer?.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Orders History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] space-y-6 shadow-xs">
        <h2 className="text-lg font-serif font-bold text-[#24221F]">Customer Orders ({orders.length})</h2>

        {orders.length === 0 ? (
          <p className="text-xs text-[#77716A]">No orders have been placed by this customer.</p>
        ) : (
          <div className="divide-y divide-[#E2DBD0] text-xs">
            {orders.map((o) => (
              <div key={o.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-serif font-bold text-[#24221F]">Order #{o.id}</p>
                  <p className="text-[11px] text-[#77716A]">{formatDate(o.createdAt)} · {o.items?.length} items</p>
                </div>
                <div className="text-right">
                  <p className="font-serif font-bold text-[#24221F]">{formatCurrency(o.total)}</p>
                  <span className="text-[10px] text-[#A66A4C] font-semibold">{o.orderStatus}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
