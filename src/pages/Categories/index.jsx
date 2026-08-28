import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { categoryService } from '../../services/categoryService';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await categoryService.getCategories();
        setCategories(list || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-3 border-b border-[#E2DBD0] pb-8">
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
          Product Taxonomy
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#24221F] tracking-tight">
          Technology & Hardware Domains
        </h1>
        <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed font-light">
          Explore our curated ranges of laptops, components, peripherals, and high-performance computing devices.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-4/3 bg-[#E8E0D5] rounded-3xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="py-24 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#E8E0D5] text-[#77716A] mx-auto flex items-center justify-center">
            <Package className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-2xl font-serif text-[#24221F]">No categories available yet.</h3>
          <p className="text-xs text-[#77716A] leading-relaxed font-light">
            Categories configured in the catalogue will be displayed here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#24221F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#A66A4C] transition-colors"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id || idx}
              to={`/products?category=${cat.slug}`}
              className="group rounded-3xl p-5 bg-[#E8E0D5]/30 hover:bg-[#E8E0D5]/70 border border-[#E2DBD0] transition-all duration-500 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#E8E0D5]">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover editorial-img-hover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#77716A]">
                      <Package className="w-8 h-8 stroke-[1.2]" />
                    </div>
                  )}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#24221F]/80 backdrop-blur-xs text-[#F4F0E8] text-[9px] uppercase font-bold tracking-widest">
                    0{idx + 1}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-serif font-bold text-[#24221F] group-hover:text-[#A66A4C] transition-colors">
                    {cat.name}
                  </h3>
                  {cat.tagline && (
                    <p className="text-xs text-[#77716A] italic font-serif">
                      “{cat.tagline}”
                    </p>
                  )}
                </div>

                {cat.description && (
                  <p className="text-xs text-[#77716A] leading-relaxed font-light">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-[#E2DBD0]/60 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#24221F] group-hover:text-[#A66A4C]">
                <span>Explore Category</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
