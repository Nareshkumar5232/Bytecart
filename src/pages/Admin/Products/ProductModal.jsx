import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { useToast } from '../../../context/ToastContext';
import { X, Save } from 'lucide-react';

export default function ProductModal({ product, categories, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    name: '',
    categorySlug: categories[0]?.slug || 'laptops',
    categoryName: categories[0]?.name || 'Laptops',
    brand: '',
    price: '',
    originalPrice: '',
    stock: 10,
    inStock: true,
    sku: '',
    tagline: '',
    description: '',
    images: '',
    processor: '',
    ram: '',
    storage: '',
    gpu: '',
    display: '',
    os: '',
    weight: '',
    warranty: '1 Year Official Warranty'
  });

  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        categorySlug: product.categorySlug || categories[0]?.slug || 'laptops',
        categoryName: product.categoryName || categories[0]?.name || 'Laptops',
        brand: product.brand || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        stock: product.stock !== undefined ? product.stock : 10,
        inStock: product.inStock !== false,
        sku: product.sku || '',
        tagline: product.tagline || '',
        description: product.description || '',
        images: Array.isArray(product.images) ? product.images.join(', ') : (product.images || ''),
        processor: product.specs?.processor || '',
        ram: product.specs?.ram || '',
        storage: product.specs?.storage || '',
        gpu: product.specs?.gpu || '',
        display: product.specs?.display || '',
        os: product.specs?.os || '',
        weight: product.weight || '',
        warranty: product.warranty || '1 Year Official Warranty'
      });
    }
  }, [product, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categorySlug) {
      addToast('Name, price, and category are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const categoryObj = categories.find(c => c.slug === formData.categorySlug);
      const imagesArray = formData.images
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        categorySlug: formData.categorySlug,
        categoryName: categoryObj?.name || formData.categorySlug,
        brand: formData.brand || 'Bytecart',
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        stock: Number(formData.stock),
        inStock: Boolean(formData.inStock),
        sku: formData.sku,
        tagline: formData.tagline,
        description: formData.description,
        images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80'],
        weight: formData.weight,
        warranty: formData.warranty,
        specs: {
          processor: formData.processor,
          ram: formData.ram,
          storage: formData.storage,
          gpu: formData.gpu,
          display: formData.display,
          os: formData.os,
        }
      };

      if (product) {
        await adminService.updateProduct(product.id, payload);
        addToast('Product updated successfully.', 'success');
      } else {
        await adminService.createProduct(payload);
        addToast('Product created successfully.', 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to save product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#24221F]/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#F5F2EC] rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-4">
          <h2 className="text-xl font-serif font-bold text-[#24221F]">
            {product ? 'Edit Hardware Product' : 'Add New Hardware Product'}
          </h2>
          <button onClick={onClose} className="p-1 text-[#77716A] hover:text-[#24221F]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. ProDesk Extreme 32"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Category *</label>
              <select
                value={formData.categorySlug}
                onChange={e => setFormData({ ...formData, categorySlug: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              >
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Brand / Manufacturer</label>
              <input
                type="text"
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Bytecart Performance, ASUS, Intel"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">SKU Code</label>
              <input
                type="text"
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. SKU-BYTE-9921"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Price (₹) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="49999"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Original Price (₹)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="54999"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Inventory Stock Quantity</label>
              <input
                type="number"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                placeholder="10"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Official Warranty</label>
              <input
                type="text"
                value={formData.warranty}
                onChange={e => setFormData({ ...formData, warranty: e.target.value })}
                placeholder="1 Year Official Warranty"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold uppercase tracking-wider text-[#77716A]">Image URLs (comma-separated)</label>
            <input
              type="text"
              value={formData.images}
              onChange={e => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold uppercase tracking-wider text-[#77716A]">Short Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={e => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="High-performance machine for engineering workflows."
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2DBD0]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold uppercase tracking-wider text-[#77716A]">Hardware Specifications</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              <input
                type="text"
                value={formData.processor}
                onChange={e => setFormData({ ...formData, processor: e.target.value })}
                placeholder="CPU: Core i7 14700"
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-[11px]"
              />
              <input
                type="text"
                value={formData.ram}
                onChange={e => setFormData({ ...formData, ram: e.target.value })}
                placeholder="RAM: 32GB DDR5"
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-[11px]"
              />
              <input
                type="text"
                value={formData.storage}
                onChange={e => setFormData({ ...formData, storage: e.target.value })}
                placeholder="Storage: 1TB NVMe"
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-[11px]"
              />
              <input
                type="text"
                value={formData.gpu}
                onChange={e => setFormData({ ...formData, gpu: e.target.value })}
                placeholder="GPU: RTX 4070 12GB"
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-[11px]"
              />
              <input
                type="text"
                value={formData.display}
                onChange={e => setFormData({ ...formData, display: e.target.value })}
                placeholder="Display: 16-inch 165Hz"
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-[11px]"
              />
              <input
                type="text"
                value={formData.os}
                onChange={e => setFormData({ ...formData, os: e.target.value })}
                placeholder="OS: Windows 11 Pro"
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-[11px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E2DBD0]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#E2DBD0] text-xs font-semibold uppercase tracking-wider text-[#77716A] hover:text-[#24221F]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving Product...' : 'Save Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
