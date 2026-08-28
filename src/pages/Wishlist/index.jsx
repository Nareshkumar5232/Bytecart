import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="pt-36 pb-28 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#E8E0D5] text-[#A66A4C] mx-auto flex items-center justify-center">
          <Heart className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            Saved Products
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#24221F]">
            Your wishlist is empty.
          </h1>
        </div>

        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-[#F4F0E8] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2DBD0] pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
            Curated Favorites
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#24221F] tracking-tight mt-1">
            My Wishlist ({wishlistItems.length})
          </h1>
        </div>
        <Link
          to="/products"
          className="text-xs font-semibold uppercase tracking-wider text-[#77716A] hover:text-[#24221F] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Collection</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            className="bg-[#EAE4DA]/30 rounded-3xl p-5 border border-[#E2DBD0] space-y-4 flex flex-col justify-between group"
          >
            <div>
              {/* Product Image */}
              <Link
                to={`/products/${product.slug}`}
                className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#EAE4DA] block"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#F5F2EC]/90 text-[#77716A] hover:text-red-700 flex items-center justify-center transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Link>

              {/* Info */}
              <div className="pt-3 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A66A4C]">
                  {product.categoryName}
                </span>
                <h3 className="text-lg font-serif font-bold text-[#24221F] group-hover:text-[#A66A4C] transition-colors leading-snug">
                  <Link to={`/products/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="text-xs text-[#77716A] line-clamp-1">{product.material?.split('&')[0]}</p>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="pt-3 border-t border-[#E2DBD0] flex items-center justify-between">
              <span className="font-serif font-bold text-base text-[#24221F]">
                {formatCurrency(product.price)}
              </span>

              <button
                onClick={() => addToCart(product, 1, true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-[#F5F2EC] text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
