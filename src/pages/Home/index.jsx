import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
  Truck,
  Heart,
  Plus,
  Package,
  RotateCcw
} from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMaterial, setActiveMaterial] = useState(0);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [featured, all, cats] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getProducts(),
          categoryService.getCategories(),
        ]);
        setFeaturedProducts(featured || []);
        setNewArrivals((all || []).slice(0, 4));
        setCategories(cats || []);
      } catch (err) {
        console.error('Error fetching home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const heroProduct = featuredProducts[0];
  const secondaryProducts = featuredProducts.slice(1, 3);

  const materials = [
    {
      title: 'Solid European White Oak',
      origin: 'FSC-Certified Northern Forests',
      desc: 'Selected for dense, interlocking grain structures and seasoned slowly in low-humidity kilns to resist seasonal warping in tropical climates.',
      image: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Italian Wool & Cotton Bouclé',
      origin: 'Biella Textile Mills, Italy',
      desc: 'Woven with varying yarn tensions to create an inviting textural loop with exceptional 60,000 Martindale rub durability.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Honed Roman Travertine',
      origin: 'Tivoli Quarry, Central Italy',
      desc: 'Formed through geological calcium carbonate deposits, honed to a smooth matte finish that highlights organic cellular porosity.',
      image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="space-y-28 md:space-y-40 pb-20">
      {/* =========================================================================
          1. IMMERSIVE EDITORIAL HERO SECTION
          ========================================================================= */}
      <section className="relative pt-28 md:pt-36 lg:pt-40 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Architectural Typography (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6 lg:space-y-8 z-10"
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-[#E8E0D5]/70 border border-[#E2DBD0] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A66A4C] animate-pulse" />
              <span>Curated Living — Atelier 2026</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif text-[#24221F] tracking-tight leading-[1.08]">
                Furniture that gives your space a <span className="italic font-normal text-[#A66A4C]">character.</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-[#77716A] max-w-lg leading-relaxed font-light pt-2">
                A study in sculptural silhouettes, natural European timber, and tactile textiles. Built for real spaces, intentional rituals, and slower living.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products"
                className="px-8 py-4 rounded-full bg-[#24221F] hover:bg-[#A66A4C] active:scale-[0.99] text-[#F4F0E8] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm flex items-center gap-2 group"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/contact"
                className="px-6 py-4 rounded-full border border-[#24221F]/80 text-[#24221F] hover:bg-[#E8E0D5] text-xs font-semibold uppercase tracking-wider transition-all duration-300"
              >
                Studio Consultation
              </Link>
            </div>

            {/* Atelier Spec Pill */}
            <div className="pt-6 border-t border-[#E2DBD0] grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A66A4C] font-bold block">Materiality</span>
                <span className="text-[#24221F] font-medium text-[11px] sm:text-xs">FSC Certified Timber</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A66A4C] font-bold block">Delivery</span>
                <span className="text-[#24221F] font-medium text-[11px] sm:text-xs">White-Glove Placement</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#A66A4C] font-bold block">Atelier</span>
                <span className="text-[#24221F] font-medium text-[11px] sm:text-xs">Anna Nagar, Chennai</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dominant Architectural Photography (Span 7) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative"
          >
            <div className="relative aspect-4/3 sm:aspect-16/11 lg:aspect-4/3 rounded-[2.5rem] overflow-hidden bg-[#E8E0D5] shadow-2xl border border-[#E2DBD0]">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85"
                alt="Contemporary light-filled living room featuring Bytecart architectural furniture"
                className="w-full h-full object-cover editorial-img-hover"
                loading="eager"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#24221F]/50 via-transparent to-transparent" />

              {/* Floating Architectural Atelier Badge */}
              <div className="absolute bottom-6 left-6 right-6 sm:left-8 sm:right-auto bg-[#F4F0E8]/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#E2DBD0] shadow-lg max-w-sm flex items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#A66A4C] block">
                    BYTECART PRIVATE LIMITED
                  </span>
                  <p className="font-serif font-bold text-sm sm:text-base text-[#24221F]">
                    Architectural Atelier & Living
                  </p>
                  <p className="text-[11px] text-[#77716A]">Anna Nagar, Chennai – 600040</p>
                </div>
                <Link
                  to="/products"
                  className="w-9 h-9 rounded-full bg-[#24221F] text-white hover:bg-[#A66A4C] flex items-center justify-center transition-colors shrink-0"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          2. EDITORIAL BRAND PHILOSOPHY STATEMENT
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto text-center space-y-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A66A4C]">
          Design Philosophy
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#24221F] leading-tight font-light">
          “Furniture should not simply occupy a room. It should <span className="italic font-normal text-[#A66A4C]">shape how the room feels.</span>”
        </h2>
        <div className="w-16 h-[1.5px] bg-[#A66A4C] mx-auto mt-4" />
      </section>

      {/* =========================================================================
          3. EDITORIAL ROOM DOMAINS
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2DBD0] pb-6">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
              Room Taxonomy
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#24221F] tracking-tight mt-1">
              Curated by Atmosphere
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs font-semibold uppercase tracking-wider text-[#A66A4C] hover:text-[#24221F] inline-flex items-center gap-1 group"
          >
            <span>Explore All Room Domains</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#E8E0D5]/30 border border-[#E2DBD0] space-y-3">
            <p className="text-sm text-[#77716A] font-serif">No categories available yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#24221F] hover:text-[#A66A4C]"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((cat, index) => (
              <Link
                key={cat.id || index}
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col space-y-4 rounded-3xl p-4 bg-[#E8E0D5]/30 hover:bg-[#E8E0D5]/70 border border-[#E2DBD0]/70 transition-all duration-500"
              >
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
                    0{index + 1} / {cat.shortName || cat.name}
                  </span>
                </div>

                <div className="px-2 pb-2 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-serif font-bold text-[#24221F] group-hover:text-[#A66A4C] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                  {cat.tagline && (
                    <p className="text-xs text-[#77716A] italic font-serif">
                      “{cat.tagline}”
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          4. THE COLLECTION: ASYMMETRIC SIGNATURE SHOWCASE
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2DBD0] pb-6">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
              Signature Pieces
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#24221F] tracking-tight mt-1">
              The Collection
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold uppercase tracking-wider text-[#A66A4C] hover:text-[#24221F] inline-flex items-center gap-1 group"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="p-16 text-center rounded-[2.5rem] bg-[#E8E0D5]/30 border border-[#E2DBD0] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E8E0D5] text-[#77716A] mx-auto flex items-center justify-center">
              <Package className="w-6 h-6 stroke-[1.5]" />
            </div>
            <p className="text-base text-[#24221F] font-serif">No products available yet.</p>
            <p className="text-xs text-[#77716A] max-w-sm mx-auto font-light">
              Pieces commissioned from our Chennai atelier will be catalogued here.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#24221F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#A66A4C] transition-colors mt-2"
            >
              <span>Contact Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {heroProduct && (
              <div className="lg:col-span-7 bg-[#E8E0D5]/40 rounded-[2.5rem] p-6 sm:p-10 border border-[#E2DBD0] flex flex-col justify-between space-y-8 group">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A66A4C]">
                      01 / {heroProduct.categoryName}
                    </span>
                    {heroProduct.badge && (
                      <span className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 bg-[#24221F] text-[#F4F0E8] rounded-full">
                        {heroProduct.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-serif text-[#24221F] group-hover:text-[#A66A4C] transition-colors leading-tight">
                    <Link to={`/products/${heroProduct.slug}`}>{heroProduct.name}</Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed max-w-xl font-light">
                    {heroProduct.description}
                  </p>
                </div>

                <Link
                  to={`/products/${heroProduct.slug}`}
                  className="aspect-16/10 rounded-2xl overflow-hidden bg-[#E8E0D5] relative block"
                >
                  <img
                    src={heroProduct.images?.[0]}
                    alt={heroProduct.name}
                    className="w-full h-full object-cover editorial-img-hover"
                  />
                </Link>

                <div className="pt-4 border-t border-[#E2DBD0] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#77716A] block">Handcrafted Price</span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-[#24221F]">
                      {formatCurrency(heroProduct.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleWishlist(heroProduct)}
                      className={`p-3 rounded-full border transition-colors cursor-pointer ${
                        isInWishlist(heroProduct.id)
                          ? 'bg-[#A66A4C] text-white border-[#A66A4C]'
                          : 'border-[#24221F] text-[#24221F] hover:bg-[#24221F] hover:text-white'
                      }`}
                      title="Save to wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(heroProduct.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => addToCart(heroProduct)}
                      className="px-6 py-3 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-[#F4F0E8] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            )}

            {secondaryProducts.length > 0 && (
              <div className="lg:col-span-5 flex flex-col justify-between gap-8">
                {secondaryProducts.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="bg-[#E8E0D5]/30 rounded-3xl p-6 border border-[#E2DBD0] space-y-4 flex flex-col justify-between group hover:border-[#77716A] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A66A4C]">
                          0{index + 2} / {item.categoryName}
                        </span>
                        <h4 className="text-xl font-serif font-bold text-[#24221F] group-hover:text-[#A66A4C] transition-colors mt-0.5">
                          <Link to={`/products/${item.slug}`}>{item.name}</Link>
                        </h4>
                      </div>
                      <span className="text-base font-serif font-bold text-[#24221F]">
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    <Link
                      to={`/products/${item.slug}`}
                      className="aspect-16/9 rounded-2xl overflow-hidden bg-[#E8E0D5] block relative"
                    >
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-full h-full object-cover editorial-img-hover"
                      />
                    </Link>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="text-[#77716A] text-[11px]">{item.material?.split('&')[0]}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="inline-flex items-center gap-1 text-[#24221F] hover:text-[#A66A4C] font-semibold uppercase tracking-wider text-[11px] underline underline-offset-4 cursor-pointer"
                      >
                        <span>Quick Add</span>
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* =========================================================================
          5. EDITORIAL MATERIAL & CRAFTSMANSHIP DEEP DIVE
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="bg-[#24221F] text-[#F4F0E8] rounded-[2.5rem] p-8 sm:p-14 lg:p-20 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C08A6A]">
                  Material Integrity & Sourcing
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif tracking-tight leading-tight">
                  Designed for the way you live.
                </h2>
                <p className="text-xs sm:text-sm text-[#BDB6AF] leading-relaxed font-light max-w-lg">
                  Every joinery angle, hand-waxed grain, and bouclé weave is created in partnership with master woodworkers and heritage mills. We build pieces intended to age with graceful dignity.
                </p>
              </div>

              {/* Material Switcher Tabs */}
              <div className="space-y-4">
                {materials.map((m, idx) => (
                  <div
                    key={m.title}
                    onClick={() => setActiveMaterial(idx)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      activeMaterial === idx
                        ? 'bg-[#3A3632] border-[#C08A6A] shadow-md'
                        : 'border-[#3A3632] hover:border-[#6F665F] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif font-bold text-base text-[#F4F0E8]">{m.title}</h4>
                      <span className="text-[10px] uppercase font-semibold text-[#C08A6A] tracking-wider">
                        {m.origin}
                      </span>
                    </div>
                    {activeMaterial === idx && (
                      <p className="text-xs text-[#BDB6AF] mt-2 leading-relaxed font-light">
                        {m.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Material Image */}
            <div className="lg:col-span-6">
              <div className="aspect-4/3 sm:aspect-16/11 rounded-3xl overflow-hidden bg-[#3A3632] border border-[#4A4642] shadow-2xl">
                <img
                  src={materials[activeMaterial].image}
                  alt={materials[activeMaterial].title}
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. NEW ARRIVALS
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2DBD0] pb-6">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
              Fresh from Atelier
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#24221F] tracking-tight mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold uppercase tracking-wider text-[#A66A4C] hover:text-[#24221F] inline-flex items-center gap-1 group"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {newArrivals.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#E8E0D5]/30 border border-[#E2DBD0] space-y-3">
            <p className="text-sm text-[#77716A] font-serif">No new releases available yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#24221F] hover:text-[#A66A4C]"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => {
              const isWished = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="group flex flex-col space-y-3.5"
                >
                  <Link
                    to={`/products/${product.slug}`}
                    className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#E8E0D5] block"
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover editorial-img-hover"
                      loading="lazy"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-[#24221F]/90 text-[#F4F0E8] rounded-full backdrop-blur-xs">
                        {product.badge}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isWished
                          ? 'bg-[#A66A4C] text-white opacity-100'
                          : 'bg-[#F4F0E8]/80 text-[#24221F] hover:bg-white opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#24221F] text-white hover:bg-[#A66A4C] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Add to cart"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </Link>

                  <div className="flex justify-between items-start pt-1">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase tracking-[0.16em] text-[#77716A] font-medium block">
                        {product.categoryName}
                      </span>
                      <h3 className="text-base font-serif font-bold text-[#24221F] group-hover:text-[#A66A4C] transition-colors leading-snug">
                        <Link to={`/products/${product.slug}`}>{product.name}</Link>
                      </h3>
                    </div>

                    <span className="text-sm font-semibold font-serif text-[#24221F] shrink-0 ml-2">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          7. BESPOKE ATELIER & ARCHITECTURAL CONSULTATION BANNER
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="bg-[#E8E0D5]/50 border border-[#E2DBD0] rounded-3xl p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#A66A4C]">
              Architectural Collaborations
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#24221F]">
              Need custom dimensions or bespoke room styling?
            </h3>
            <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed">
              Our Anna Nagar studio works alongside architects, interior designers, and discerning homeowners across Chennai and Pan-India.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-[#F4F0E8] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              Book Studio Consultation
            </Link>
            <a
              href="tel:+914431544571"
              className="px-6 py-3.5 rounded-full border border-[#24221F] text-[#24221F] hover:bg-[#24221F] hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Call 044 3154 4571
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
