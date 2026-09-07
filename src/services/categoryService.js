import { apiRequest } from './api';

export const categoryService = {
  async getCategories() {
    return await apiRequest('/categories');
  },

  async getCategoryBySlug(slug) {
    const categories = await this.getCategories();
    return categories.find((c) => c.slug === slug || c.id === slug) || null;
  }
};
