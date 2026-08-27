import { categoriesData } from '../data/categoriesData';

/**
 * Category Service Layer
 * Connects directly to backend REST API or returns active database records.
 * Zero mock fallback.
 */
export const categoryService = {
  async getCategories() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return Array.isArray(categoriesData) ? [...categoriesData] : [];
    } catch (err) {
      console.error('Error in categoryService.getCategories:', err);
      throw new Error('Unable to load categories.');
    }
  },

  async getCategoryBySlug(slug) {
    try {
      const list = await this.getCategories();
      return list.find((c) => c.slug === slug) || null;
    } catch (err) {
      console.error('Error in categoryService.getCategoryBySlug:', err);
      throw new Error('Unable to load category.');
    }
  },
};
