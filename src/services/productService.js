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
    return await apiRequest(endpoint);
  },

  async getProductBySlug(slug) {
    return await apiRequest(`/products/${slug}`);
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
