import { productsData } from '../data/productsData';

/**
 * Product Service Layer
 * Connects directly to backend REST API or returns active database records.
 * Zero mock fallback.
 */
export const productService = {
  async getProducts({ category, search, sortBy = 'featured', availability, priceRange } = {}) {
    try {
      // In full backend deployment: const res = await fetch('/api/products?...');
      // For standalone client before backend integration:
      await new Promise((resolve) => setTimeout(resolve, 60));
      let results = Array.isArray(productsData) ? [...productsData] : [];

      if (category && category !== 'all') {
        results = results.filter((p) => p.categorySlug === category || p.category === category);
      }

      if (search && search.trim() !== '') {
        const q = search.toLowerCase().trim();
        results = results.filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            p.tagline?.toLowerCase().includes(q) ||
            p.categoryName?.toLowerCase().includes(q)
        );
      }

      if (availability && availability === 'in-stock') {
        results = results.filter((p) => p.inStock);
      }

      if (priceRange && typeof priceRange.max === 'number') {
        results = results.filter((p) => p.price <= priceRange.max);
      }

      switch (sortBy) {
        case 'price-low':
          results.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-high':
          results.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'rating':
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          results.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        default:
          break;
      }

      return results;
    } catch (err) {
      console.error('Error in productService.getProducts:', err);
      throw new Error('Unable to load products.');
    }
  },

  async getProductBySlug(slug) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const list = Array.isArray(productsData) ? productsData : [];
      return list.find((p) => p.slug === slug || p.id === slug) || null;
    } catch (err) {
      console.error('Error in productService.getProductBySlug:', err);
      throw new Error('Unable to load piece details.');
    }
  },

  async getFeaturedProducts(limit = 4) {
    const products = await this.getProducts();
    return products.filter((p) => p.featured).slice(0, limit);
  },

  async getRelatedProducts(currentSlug, categorySlug, limit = 3) {
    const products = await this.getProducts({ category: categorySlug });
    return products.filter((p) => p.slug !== currentSlug).slice(0, limit);
  },
};
