import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || location.state?.redirect || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      // Toast handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto flex items-center justify-center">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-[2.5rem] overflow-hidden border border-[#E2DBD0] bg-[#E8E0D5]/30 shadow-xl">
        {/* Left Column: Editorial Architectural Photography (Span 6) */}
        <div className="hidden lg:flex lg:col-span-6 relative bg-[#24221F] text-[#F4F0E8] p-12 flex-col justify-between overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80"
            alt="Technology workspace setup"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24221F] via-[#24221F]/60 to-transparent" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-[#C08A6A] hover:text-white transition-colors mb-6">
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C08A6A] block">
              Customer Portal
            </span>
            <h2 className="text-3xl xl:text-4xl font-serif text-[#F4F0E8] mt-2 leading-tight">
              Welcome back to your Bytecart account.
            </h2>
          </div>

          <div className="relative z-10 space-y-3 border-t border-[#4A4642] pt-6">
            <p className="text-xs text-[#BDB6AF] font-light leading-relaxed">
              “Connecting you with premium technology and high-performance computing components.”
            </p>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C08A6A] block">
              Bytecart Private Limited • Anna Nagar, Chennai
            </span>
          </div>
        </div>

        {/* Right Column: Clean Minimal Login Form (Span 6) */}
        <div className="lg:col-span-6 p-8 sm:p-14 lg:p-16 flex flex-col justify-center space-y-8 bg-[#F4F0E8]">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Logo />
              <Link to="/register" state={{ from: location.state?.from || location.state?.redirect }} className="text-xs text-[#A66A4C] hover:text-[#24221F] uppercase font-semibold tracking-wider">
                Create Account →
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#24221F] pt-2">
              Sign In to Bytecart
            </h1>
            <p className="text-xs text-[#77716A] leading-relaxed">
              Access your order timeline, saved delivery addresses, and curated wishlist.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#77716A] block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9E9890] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#E8E0D5]/40 border border-[#E2DBD0] text-xs text-[#24221F] focus:bg-white focus:outline-none focus:border-[#A66A4C] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#77716A] block">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-[#A66A4C] hover:text-[#24221F] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9E9890] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-[#E8E0D5]/40 border border-[#E2DBD0] text-xs text-[#24221F] focus:bg-white focus:outline-none focus:border-[#A66A4C] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9E9890] hover:text-[#24221F]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-[#77716A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E2DBD0] text-[#A66A4C] accent-[#A66A4C]"
                />
                <span>Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-full bg-[#24221F] hover:bg-[#A66A4C] active:scale-[0.99] disabled:opacity-50 text-[#F4F0E8] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm mt-2"
            >
              {submitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
