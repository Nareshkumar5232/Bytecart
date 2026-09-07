import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { useToast } from '../../../context/ToastContext';
import { FolderTree, Plus, Trash2, RefreshCw } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCategories();
      setCategories(res || []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      setSaving(true);
      await adminService.createCategory({
        name: newName.trim(),
        description: newDesc.trim(),
      });
      addToast(`Category "${newName}" created.`, 'success');
      setNewName('');
      setNewDesc('');
      fetchCategories();
    } catch (err) {
      addToast(err.message || 'Failed to create category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await adminService.deleteCategory(id);
      addToast(`Category "${name}" deleted.`, 'info');
      fetchCategories();
    } catch (err) {
      addToast(err.message || 'Failed to delete category.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            Taxonomy Structure
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#24221F] font-bold">
            Hardware Categories
          </h1>
        </div>

        <button
          onClick={fetchCategories}
          className="self-start sm:self-auto px-4 py-2 rounded-full border border-[#E2DBD0] bg-white hover:bg-[#EAE4DA] text-xs font-semibold text-[#24221F] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#77716A]" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleCreate} className="p-6 rounded-3xl bg-white border border-[#E2DBD0] space-y-4 shadow-xs">
        <h2 className="text-sm font-serif font-bold text-[#24221F]">Create New Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <input
            type="text"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category Name (e.g. Graphics Cards, Processors)"
            className="px-4 py-2.5 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0] text-[#24221F]"
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description summary..."
            className="px-4 py-2.5 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0] text-[#24221F]"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{saving ? 'Creating...' : 'Add Category'}</span>
          </button>
        </div>
      </form>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id || c.slug} className="p-5 rounded-2xl bg-white border border-[#E2DBD0] flex items-start justify-between gap-3 shadow-xs">
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-sm text-[#24221F]">{c.name}</h3>
              <p className="text-[11px] text-[#77716A] line-clamp-2">{c.description || 'Hardware category'}</p>
              <code className="text-[10px] text-[#A66A4C] font-mono">/{c.slug}</code>
            </div>
            <button
              onClick={() => handleDelete(c.id || c.slug, c.name)}
              className="p-1.5 text-[#9E9890] hover:text-red-700 transition-colors"
              title="Delete Category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
