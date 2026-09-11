import { apiRequest } from './api';

export const productService = {
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.availability) query.set('availability', params.availability);
    if (params.brand) query.set('brand', params.brand);
    if (params.priceRange?.max) query.set('maxPrice', params.priceRange.max);

    const queryString = query.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    try {
      const res = await apiRequest(endpoint);
      return Array.isArray(res) ? res : (res?.products || []);
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          const fallbackEndpoint = queryString ? `/product?${queryString}` : '/product';
          const res = await apiRequest(fallbackEndpoint);
          return Array.isArray(res) ? res : (res?.products || []);
        } catch {
          return [];
        }
      }
      return [];
    }
  },

  async getProductBySlug(slug) {
    try {
      return await apiRequest(`/products/${slug}`);
    } catch (err) {
      if (err.status === 404 || err.message?.includes('404')) {
        try {
          return await apiRequest(`/product/${slug}`);
        } catch {
          return null;
        }
      }
      return null;
    }
  },

  async getFeaturedProducts(limit = 4) {
    const products = await this.getProducts();
    return products.filter((p) => p.featured).slice(0, limit);
  },

  async getRelatedProducts(currentSlug, categorySlug, limit = 3) {
    const products = await this.getProducts({ category: categorySlug });
    return products.filter((p) => p.slug !== currentSlug).slice(0, limit);
  }
};
