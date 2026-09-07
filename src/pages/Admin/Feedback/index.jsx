import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { formatDate } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { MessageSquare, CheckCircle, Trash2, RefreshCw } from 'lucide-react';

export default function AdminFeedback() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await adminService.getFeedback();
      setMessages(res || []);
    } catch (err) {
      console.error('Failed to load feedback', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleToggleRead = async (id, currentRead) => {
    try {
      await adminService.updateFeedbackStatus(id, { read: !currentRead });
      fetchFeedback();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await adminService.deleteFeedback(id);
      addToast('Message deleted', 'info');
      fetchFeedback();
    } catch (err) {
      addToast('Failed to delete message', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            Customer Inquiries
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#24221F] font-bold">
            Contact & Feedback Inbox
          </h1>
        </div>

        <button
          onClick={fetchFeedback}
          className="self-start sm:self-auto px-4 py-2 rounded-full border border-[#E2DBD0] bg-white hover:bg-[#EAE4DA] text-xs font-semibold text-[#24221F] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#77716A]" />
          <span>Refresh Inbox</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#24221F] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-serif text-[#77716A] uppercase tracking-wider">Loading Customer Feedback...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center space-y-2 border border-[#E2DBD0]">
            <MessageSquare className="w-8 h-8 text-[#9E9890] mx-auto" />
            <p className="text-base font-serif text-[#24221F]">No customer feedback yet.</p>
            <p className="text-xs text-[#77716A]">Messages submitted via the contact page will appear here.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-3xl border transition-all ${
                msg.read
                  ? 'bg-white border-[#E2DBD0]'
                  : 'bg-[#EAE4DA]/50 border-[#A66A4C]/50 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DBD0] pb-3 mb-3">
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#24221F]">{msg.subject || 'General Inquiry'}</h3>
                  <p className="text-xs text-[#77716A]">From: <strong className="text-[#24221F]">{msg.name}</strong> ({msg.email}) {msg.phone && `· Phone: ${msg.phone}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#77716A]">{formatDate(msg.createdAt)}</span>
                  <button
                    onClick={() => handleToggleRead(msg.id, msg.read)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 cursor-pointer ${
                      msg.read
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>{msg.read ? 'Mark Unread' : 'Mark Read'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1 text-[#9E9890] hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#24221F] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
