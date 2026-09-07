import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../../services/adminService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Users, RefreshCw } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCustomers();
      setCustomers(res || []);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            User Accounts
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#24221F] font-bold">
            Customer Directory
          </h1>
        </div>

        <button
          onClick={fetchCustomers}
          className="self-start sm:self-auto px-4 py-2 rounded-full border border-[#E2DBD0] bg-white hover:bg-[#EAE4DA] text-xs font-semibold text-[#24221F] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#77716A]" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2DBD0] overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#24221F] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-serif text-[#77716A] uppercase tracking-wider">Loading Customer Accounts...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-8 h-8 text-[#9E9890] mx-auto" />
            <p className="text-base font-serif text-[#24221F]">No customer accounts registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EAE4DA]/30 border-b border-[#E2DBD0] text-[#77716A] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Phone</th>
                  <th className="py-3 px-4 font-semibold">Total Orders</th>
                  <th className="py-3 px-4 font-semibold">Lifetime Spend</th>
                  <th className="py-3 px-4 font-semibold">Joined Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DBD0]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F5F2EC]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#24221F]">{c.name}</p>
                      <p className="text-[10px] text-[#77716A]">{c.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#77716A]">{c.phone}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#24221F]">{c.totalOrders} orders</td>
                    <td className="py-3.5 px-4 font-serif font-bold text-[#24221F]">{formatCurrency(c.totalSpent)}</td>
                    <td className="py-3.5 px-4 text-[#77716A]">{formatDate(c.createdAt)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/customers/${c.id}`}
                        className="px-3 py-1 rounded-full bg-[#24221F] text-white text-[10px] font-semibold uppercase hover:bg-[#A66A4C]"
                      >
                        View Details
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
