import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItemsCount,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#24221F]/60 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-screen max-w-md bg-[#F5F2EC] shadow-2xl border-l border-[#E2DBD0] flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#E2DBD0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#24221F]" />
                  <span className="font-serif text-lg text-[#24221F] font-bold">
                    Your Cart ({totalItemsCount})
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 text-[#77716A] hover:text-[#24221F] transition-colors rounded-full hover:bg-[#EAE4DA]"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-16 h-16 rounded-full bg-[#E8E0D5] flex items-center justify-center text-[#77716A]">
                      <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif text-lg text-[#24221F]">
                        Your cart is empty.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        closeCart();
                        navigate('/products');
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#24221F] text-[#F4F0E8] text-xs font-semibold uppercase tracking-wider hover:bg-[#A66A4C] transition-colors cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 divide-y divide-[#E2DBD0]">
                    {items.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="pt-6 first:pt-0 flex items-center gap-4 group"
                      >
                        {/* Image */}
                        <Link
                          to={`/products/${product.slug}`}
                          onClick={closeCart}
                          className="w-20 h-20 rounded-2xl overflow-hidden bg-[#EAE4DA] shrink-0"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A66A4C]">
                            {product.categoryName}
                          </span>
                          <h4 className="text-sm font-serif font-bold text-[#24221F] truncate">
                            <Link
                              to={`/products/${product.slug}`}
                              onClick={closeCart}
                            >
                              {product.name}
                            </Link>
                          </h4>
                          <p className="text-xs font-serif font-semibold text-[#24221F]">
                            {formatCurrency(product.price)}
                          </p>

                          {/* Quantity selector */}
                          <div className="flex items-center gap-3 pt-1">
                            <div className="flex items-center border border-[#E2DBD0] rounded-full bg-[#EAE4DA]/50 px-1.5 py-0.5">
                              <button
                                onClick={() =>
                                  updateQuantity(product.id, quantity - 1)
                                }
                                className="p-1 text-[#77716A] hover:text-[#24221F]"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-semibold text-[#24221F] min-w-4 text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(product.id, quantity + 1)
                                }
                                className="p-1 text-[#77716A] hover:text-[#24221F]"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-[#9E9890] hover:text-[#A66A4C] p-1 transition-colors"
                          title="Remove product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-[#E2DBD0] bg-[#EAE4DA]/30 space-y-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[#77716A]">
                      <span>Estimated Subtotal</span>
                      <span className="font-serif font-bold text-[#24221F] text-sm">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#77716A]">
                      <span>Secured Insured Shipping</span>
                      <span className="text-[#A66A4C] font-medium">Complimentary</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleCheckoutClick}
                      className="w-full py-3.5 px-4 rounded-full bg-[#24221F] hover:bg-[#A66A4C] active:scale-[0.99] text-[#F5F2EC] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleViewCartClick}
                      className="w-full py-2.5 px-4 rounded-full border border-[#24221F] text-[#24221F] hover:bg-[#24221F] hover:text-[#F5F2EC] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      View Cart Page
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-[#77716A]">
                    Secured shipping & delivery coordination across India.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
