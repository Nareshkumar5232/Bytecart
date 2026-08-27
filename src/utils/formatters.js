/**
 * Format Indian Rupee currency with standard comma separators
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number') return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format price discount percentage
 */
export function calculateDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return null;
  const percent = Math.round(((originalPrice - price) / originalPrice) * 100);
  return `${percent}% OFF`;
}
