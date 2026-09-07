import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { CreditCard, RefreshCw } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPayments();
      setPayments(res || []);
    } catch (err) {
      console.error('Failed to fetch payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            Financial Transactions
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#24221F] font-bold">
            Payment Records
          </h1>
        </div>

        <button
          onClick={fetchPayments}
          className="self-start sm:self-auto px-4 py-2 rounded-full border border-[#E2DBD0] bg-white hover:bg-[#EAE4DA] text-xs font-semibold text-[#24221F] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#77716A]" />
          <span>Refresh Payments</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2DBD0] overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#24221F] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-serif text-[#77716A] uppercase tracking-wider">Loading Transactions...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <CreditCard className="w-8 h-8 text-[#9E9890] mx-auto" />
            <p className="text-base font-serif text-[#24221F]">No payment records recorded yet.</p>
            <p className="text-xs text-[#77716A]">Successful and verified online transactions will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EAE4DA]/30 border-b border-[#E2DBD0] text-[#77716A] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Payment ID</th>
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Method</th>
                  <th className="py-3 px-4 font-semibold">Gateway</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DBD0]">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F5F2EC]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-[#24221F]">{p.id}</td>
                    <td className="py-3.5 px-4 font-serif font-bold text-[#24221F]">{p.orderId}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#24221F]">{p.customerName}</p>
                      <p className="text-[10px] text-[#77716A]">{p.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-[#24221F]">{formatCurrency(p.amount)}</td>
                    <td className="py-3.5 px-4">{p.paymentMethod}</td>
                    <td className="py-3.5 px-4 text-[#77716A]">{p.gateway}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#77716A]">{formatDate(p.createdAt)}</td>
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
