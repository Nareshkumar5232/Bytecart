import { apiRequest } from './api';
import { categoriesData } from '../data/categoriesData';

export const categoryService = {
  async getCategories() {
    try {
      const res = await apiRequest('/categories');
      return Array.isArray(res) ? res : (res?.categories || []);
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          const res = await apiRequest('/admin/categories');
          return Array.isArray(res) ? res : (res?.categories || []);
        } catch {
          return categoriesData || [];
        }
      }
      return categoriesData || [];
    }
  },

  async getCategoryBySlug(slug) {
    const categories = await this.getCategories();
    return categories.find((c) => c.slug === slug || c.id === slug) || null;
  }
};
