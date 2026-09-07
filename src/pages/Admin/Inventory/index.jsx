import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { useToast } from '../../../context/ToastContext';
import { Boxes, Save, RefreshCw } from 'lucide-react';

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState({});
  const { addToast } = useToast();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await adminService.getInventory();
      setItems(res || []);
      const map = {};
      (res || []).forEach(item => {
        map[item.id] = item.currentStock;
      });
      setEditingStock(map);
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockUpdate = async (productId) => {
    const stockVal = editingStock[productId];
    try {
      await adminService.updateInventory(productId, {
        stock: Number(stockVal),
        inStock: Number(stockVal) > 0
      });
      addToast('Inventory count updated successfully.', 'success');
      fetchInventory();
    } catch (err) {
      addToast(err.message || 'Failed to update stock', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            Stock Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#24221F] font-bold">
            Real Inventory Levels
          </h1>
        </div>

        <button
          onClick={fetchInventory}
          className="self-start sm:self-auto px-4 py-2 rounded-full border border-[#E2DBD0] bg-white hover:bg-[#EAE4DA] text-xs font-semibold text-[#24221F] flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#77716A]" />
          <span>Refresh Stock</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2DBD0] overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#24221F] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-serif text-[#77716A] uppercase tracking-wider">Loading Inventory...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Boxes className="w-8 h-8 text-[#9E9890] mx-auto" />
            <p className="text-base font-serif text-[#24221F]">No inventory items available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EAE4DA]/30 border-b border-[#E2DBD0] text-[#77716A] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product Name</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Current Stock</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Quick Stock Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DBD0]">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F5F2EC]/60 transition-colors">
                    <td className="py-3.5 px-4 font-serif font-bold text-[#24221F]">{item.name}</td>
                    <td className="py-3.5 px-4 font-mono text-[#77716A]">{item.sku}</td>
                    <td className="py-3.5 px-4 text-[#77716A]">{item.categoryName}</td>
                    <td className="py-3.5 px-4 font-bold text-[#24221F]">{item.currentStock} units</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.isOutOfStock
                          ? 'bg-red-100 text-red-800'
                          : item.isLowStock
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.isOutOfStock ? 'Out of Stock' : item.isLowStock ? 'Low Stock' : 'Optimal'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="number"
                          min="0"
                          value={editingStock[item.id] !== undefined ? editingStock[item.id] : item.currentStock}
                          onChange={(e) => setEditingStock({ ...editingStock, [item.id]: e.target.value })}
                          className="w-20 px-2 py-1 rounded-lg bg-[#F5F2EC] border border-[#E2DBD0] text-center font-bold"
                        />
                        <button
                          onClick={() => handleStockUpdate(item.id)}
                          className="p-1.5 rounded-lg bg-[#24221F] text-white hover:bg-[#A66A4C] transition-colors"
                          title="Save Stock"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
