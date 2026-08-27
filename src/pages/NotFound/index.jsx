import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="pt-36 pb-24 max-w-lg mx-auto px-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-black text-2xl">
        404
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          The requested hardware resource or page URL could not be located. It may have been relocated or updated.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Browse Catalog</span>
        </Link>
      </div>
    </div>
  );
}
