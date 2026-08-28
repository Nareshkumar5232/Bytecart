import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, Phone, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || location.state?.redirect || '/account';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.phone.trim().length < 8) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto flex items-center justify-center">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-[2.5rem] overflow-hidden border border-[#E2DBD0] bg-[#E8E0D5]/30 shadow-xl">
        {/* Left Column: Architectural Imagery & Studio Ethos (Span 6) */}
        <div className="hidden lg:flex lg:col-span-6 relative bg-[#24221F] text-[#F4F0E8] p-12 flex-col justify-between overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80"
            alt="Modern laptop setup workspace"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24221F] via-[#24221F]/60 to-transparent" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-[#C08A6A] hover:text-white transition-colors mb-6">
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C08A6A] block">
              Access Premium Tech
            </span>
            <h2 className="text-3xl xl:text-4xl font-serif text-[#F4F0E8] mt-2 leading-tight">
              Create an account with Bytecart.
            </h2>
          </div>

          <div className="relative z-10 space-y-3 border-t border-[#4A4642] pt-6">
            <p className="text-xs text-[#BDB6AF] font-light leading-relaxed">
              “Join our community of technology enthusiasts, developers, and creators scaling their computing power.”
            </p>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C08A6A] block">
              Official Manufacturer Warranty • Secured Insured Shipping
            </span>
          </div>
        </div>

        {/* Right Column: Clean Registration Form (Span 6) */}
        <div className="lg:col-span-6 p-8 sm:p-14 lg:p-16 flex flex-col justify-center space-y-6 bg-[#F4F0E8]">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Logo />
              <Link to="/login" state={{ from: location.state?.from || location.state?.redirect }} className="text-xs text-[#A66A4C] hover:text-[#24221F] uppercase font-semibold tracking-wider">
                Sign In →
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#24221F] pt-2">
              Create Your Client Account
            </h1>
            <p className="text-xs text-[#77716A] leading-relaxed">
              Enjoy seamless multi-step checkout, real-time dispatch tracking, and saved address books.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A] block">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#9E9890] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Maya Ramesh"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#E8E0D5]/40 border border-[#E2DBD0] text-xs text-[#24221F] focus:bg-white focus:outline-none focus:border-[#A66A4C] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A] block">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9E9890] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@domain.com"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#E8E0D5]/40 border border-[#E2DBD0] text-xs text-[#24221F] focus:bg-white focus:outline-none focus:border-[#A66A4C] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A] block">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#9E9890] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98400 12345"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#E8E0D5]/40 border border-[#E2DBD0] text-xs text-[#24221F] focus:bg-white focus:outline-none focus:border-[#A66A4C] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A] block">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9E9890] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 chars"
                    className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[#E8E0D5]/40 border border-[#E2DBD0] text-xs text-[#24221F] focus:bg-white focus:outline-none focus:border-[#A66A4C] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#77716A] block">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9E9890] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#E8E0D5]/40 border border-[#E2DBD0] text-xs text-[#24221F] focus:bg-white focus:outline-none focus:border-[#A66A4C] transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-full bg-[#24221F] hover:bg-[#A66A4C] active:scale-[0.99] disabled:opacity-50 text-[#F4F0E8] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm mt-3"
            >
              {submitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Proceed</span>
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
