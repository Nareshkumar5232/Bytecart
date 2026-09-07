import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { useToast } from '../../../context/ToastContext';
import { Tag, Plus, Trash2, RefreshCw } from 'lucide-react';

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await adminService.getBrands();
      setBrands(res || []);
    } catch (err) {
      console.error('Failed to fetch brands', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSaving(true);
      await adminService.createBrand({ name: name.trim() });
      addToast(`Brand "${name}" registered.`, 'success');
      setName('');
      fetchBrands();
    } catch (err) {
      addToast(err.message || 'Failed to create brand.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, brandName) => {
    if (!window.confirm(`Remove brand "${brandName}"?`)) return;
    try {
      await adminService.deleteBrand(id);
      addToast(`Brand "${brandName}" removed.`, 'info');
      fetchBrands();
    } catch (err) {
      addToast(err.message || 'Failed to delete brand.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            Manufacturer Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#24221F] font-bold">
            Hardware Brands
          </h1>
        </div>

        <button
          onClick={fetchBrands}
          className="self-start sm:self-auto px-4 py-2 rounded-full border border-[#E2DBD0] bg-white hover:bg-[#EAE4DA] text-xs font-semibold text-[#24221F] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#77716A]" />
          <span>Refresh</span>
        </button>
      </div>

      <form onSubmit={handleCreate} className="p-6 rounded-3xl bg-white border border-[#E2DBD0] flex gap-3 text-xs shadow-xs">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Brand / OEM Name (e.g. ASUS ROG, Corsair, NVIDIA)"
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0] text-[#24221F]"
        />
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-white font-semibold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{saving ? 'Adding...' : 'Add Brand'}</span>
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((b) => (
          <div key={b.id} className="p-4 rounded-2xl bg-white border border-[#E2DBD0] flex items-center justify-between shadow-xs">
            <span className="font-serif font-bold text-xs text-[#24221F]">{b.name}</span>
            <button
              onClick={() => handleDelete(b.id, b.name)}
              className="p-1 text-[#9E9890] hover:text-red-700"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
