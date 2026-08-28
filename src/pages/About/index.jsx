import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/common/Logo';

export default function About() {
  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      {/* 1. Large Brand Statement */}
      <div className="max-w-3xl space-y-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
          About Bytecart
        </span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#24221F] tracking-tight leading-[1.06]">
          We believe in <br />
          <span className="italic font-normal">better technology.</span>
        </h1>
        <p className="text-base sm:text-lg text-[#77716A] leading-relaxed font-light">
          BYTECART PRIVATE LIMITED is a contemporary electronics and computer products company founded on the principle that everyday objects should offer enduring performance, honest materiality, and quiet elegance.
        </p>
      </div>

      {/* 2. Full-Width Lifestyle Imagery */}
      <div className="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden bg-[#EAE4DA] shadow-md">
        <img
          src="https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=1600&q=80"
          alt="Bytecart technology philosophy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 3. Three Editorial Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-[#E2DBD0] pt-16">
        <div className="space-y-3">
          <span className="text-xs font-serif text-[#A66A4C] text-lg font-bold">01</span>
          <h3 className="text-2xl font-serif text-[#24221F]">Technology & Performance</h3>
          <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed font-light">
            We curate laptops, computers, and components selected for high performance, reliability, and longevity.
          </p>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-serif text-[#A66A4C] text-lg font-bold">02</span>
          <h3 className="text-2xl font-serif text-[#24221F]">Ergonomics & Productivity</h3>
          <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed font-light">
            Technology should integrate seamlessly into your workflow. Our keyboards, monitors, and setups are selected for comfort, speed, and long-term ergonomic support.
          </p>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-serif text-[#A66A4C] text-lg font-bold">03</span>
          <h3 className="text-2xl font-serif text-[#24221F]">Premium Quality</h3>
          <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed font-light">
            We provide devices from leading brands and manufacturers, featuring premium engineering and robust components designed to support you for years.
          </p>
        </div>
      </div>

      {/* 4. Company & Registered Studio Info */}
      <div className="bg-[#EAE4DA]/50 rounded-3xl p-8 sm:p-14 border border-[#E2DBD0] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8 space-y-4">
          <Logo />
          <h3 className="text-2xl font-serif text-[#24221F] pt-2">
            Registered Entity Information
          </h3>
          <div className="space-y-2 text-xs sm:text-sm text-[#77716A]">
            <p>
              <strong className="text-[#24221F] font-semibold">Entity Name:</strong> BYTECART PRIVATE LIMITED
            </p>
            <p>
              <strong className="text-[#24221F] font-semibold">Studio & Registered Office:</strong> Flat No. 2, Plot No. 1051, I Block, 35th Street, 18th Main Road, Anna Nagar, Chennai – 600040
            </p>
            <p>
              <strong className="text-[#24221F] font-semibold">Official Inquiries:</strong> bytecartpvtltd@gmail.com
            </p>
            <p>
              <strong className="text-[#24221F] font-semibold">Telephone:</strong> 044 3154 4571
            </p>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-3">
          <Link
            to="/products"
            className="w-full py-3.5 px-6 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-[#F5F2EC] text-xs font-semibold uppercase tracking-wider text-center transition-colors"
          >
            Explore Collection
          </Link>
          <Link
            to="/contact"
            className="w-full py-3.5 px-6 rounded-full border border-[#24221F] text-[#24221F] hover:bg-[#24221F] hover:text-white text-xs font-semibold uppercase tracking-wider text-center transition-colors"
          >
            Contact Chennai Office
          </Link>
        </div>
      </div>
    </div>
  );
}
