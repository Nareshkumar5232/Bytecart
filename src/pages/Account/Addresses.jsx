import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, MapPin, Trash2, Edit3, Star, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { addressService } from '../../services/addressService';

export default function Addresses() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    tag: 'HOME',
    house: '',
    street: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const loadAddresses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await addressService.getAddresses(user.id);
      setAddresses(list || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { redirect: '/account/addresses' }, replace: true });
      return;
    }

    if (isAuthenticated) {
      loadAddresses();
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: user?.name || '',
      phone: user?.phone || '',
      tag: 'HOME',
      house: '',
      street: '',
      area: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: addresses.length === 0,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingId(addr.id);
    setForm({ ...addr });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this delivery address?')) {
      await addressService.deleteAddress(id);
      addToast('Address deleted.', 'info');
      loadAddresses();
    }
  };

  const handleSetDefault = async (id) => {
    await addressService.setDefaultAddress(id);
    addToast('Default delivery address updated.', 'success');
    loadAddresses();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.house || !form.street || !form.city || !form.pincode) {
      addToast('Please complete all required address fields.', 'error');
      return;
    }

    if (editingId) {
      await addressService.updateAddress(editingId, form);
      addToast('Address updated.', 'success');
    } else {
      await addressService.addAddress({ ...form, userId: user?.id || 'usr-guest' });
      addToast('New address added.', 'success');
    }
    setModalOpen(false);
    loadAddresses();
  };

  if (authLoading || (loading && isAuthenticated)) {
    return (
      <div className="pt-36 pb-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 animate-pulse">
        <div className="h-20 bg-[#E8E0D5] rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-44 bg-[#E8E0D5] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DBD0] pb-6">
        <div>
          <Link
            to="/account"
            className="text-xs font-semibold uppercase tracking-wider text-[#77716A] hover:text-[#24221F] inline-flex items-center gap-1 mb-2"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Account</span>
          </Link>
          <h1 className="text-3xl font-serif text-[#24221F] tracking-tight">
            Saved Delivery Addresses
          </h1>
          <p className="text-xs sm:text-sm text-[#77716A]">
            Manage your residential and workplace destination address book.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-[#F4F0E8] text-xs font-semibold uppercase tracking-wider transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Address</span>
        </button>
      </div>

      {/* List */}
      {addresses.length === 0 ? (
        <div className="py-24 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#E8E0D5] text-[#77716A] mx-auto flex items-center justify-center">
            <MapPin className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-2xl font-serif text-[#24221F]">No saved addresses.</h3>
          <p className="text-xs text-[#77716A] leading-relaxed font-light">
            Add your primary residence or workplace for seamless checkout.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#24221F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#A66A4C] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-6 rounded-3xl bg-[#E8E0D5]/40 border border-[#E2DBD0] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-[#24221F]">{addr.name}</span>
                    <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#24221F] text-[#F4F0E8]">
                      {addr.tag}
                    </span>
                  </div>
                  {addr.isDefault && (
                    <span className="text-[10px] text-[#A66A4C] font-semibold uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Default
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#77716A] leading-relaxed">
                  {addr.house}, {addr.street}, {addr.area}
                  <br />
                  {addr.city}, {addr.state} – {addr.pincode}
                </p>
                <p className="text-xs text-[#24221F]">Phone: {addr.phone}</p>
              </div>

              <div className="pt-3 border-t border-[#E2DBD0] flex items-center justify-between text-xs">
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[11px] text-[#A66A4C] hover:text-[#24221F] font-medium underline"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-[11px] text-[#77716A]">Primary Destination</span>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="p-1.5 text-[#77716A] hover:text-[#24221F] transition-colors"
                    title="Edit address"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-[#77716A] hover:text-red-700 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#24221F]/60 backdrop-blur-xs"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-[#F4F0E8] rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-[#E2DBD0]">
              <h3 className="text-xl font-serif text-[#24221F]">
                {editingId ? 'Edit Delivery Address' : 'Add Delivery Address'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#77716A] hover:text-[#24221F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A]">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Recipient name"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#E8E0D5]/50 border border-[#E2DBD0] text-[#24221F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A]">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 Phone"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#E8E0D5]/50 border border-[#E2DBD0] text-[#24221F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A]">Address Type</label>
                <select
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#E8E0D5]/50 border border-[#E2DBD0] text-[#24221F]"
                >
                  <option value="HOME">HOME</option>
                  <option value="OFFICE">OFFICE / WORKPLACE</option>
                  <option value="LAB">LAB / HEADQUARTERS</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A]">House / Flat / Building *</label>
                <input
                  type="text"
                  required
                  value={form.house}
                  onChange={(e) => setForm({ ...form, house: e.target.value })}
                  placeholder="Building, Flat, House details"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#E8E0D5]/50 border border-[#E2DBD0] text-[#24221F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A]">Street / Road *</label>
                  <input
                    type="text"
                    required
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    placeholder="Street or Road name"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#E8E0D5]/50 border border-[#E2DBD0] text-[#24221F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A]">Area / Locality *</label>
                  <input
                    type="text"
                    required
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    placeholder="Locality or Area"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#E8E0D5]/50 border border-[#E2DBD0] text-[#24221F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A]">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#E8E0D5]/50 border border-[#E2DBD0] text-[#24221F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A]">State *</label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#E8E0D5]/50 border border-[#E2DBD0] text-[#24221F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A]">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    placeholder="Pincode"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#E8E0D5]/50 border border-[#E2DBD0] text-[#24221F]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded border-[#E2DBD0] text-[#A66A4C] accent-[#A66A4C]"
                />
                <span className="text-xs text-[#77716A]">Set as default delivery destination</span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E2DBD0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#E2DBD0] text-[#77716A] hover:text-[#24221F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#24221F] text-white hover:bg-[#A66A4C] transition-colors uppercase tracking-wider font-semibold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
