import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';
import Logo from '../../components/common/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 max-w-md mx-auto px-4 sm:px-6 space-y-8">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="text-3xl font-serif text-[#24221F] pt-2">
          Reset Password
        </h1>
        <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed">
          Enter your registered email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <div className="bg-[#EAE4DA]/40 rounded-3xl p-8 sm:p-10 border border-[#E2DBD0] shadow-2xs space-y-6">
        {sent ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif text-[#24221F]">Check your inbox</h3>
            <p className="text-xs text-[#77716A] leading-relaxed">
              We have sent a secure password recovery link to <strong>{email}</strong>.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A66A4C] hover:text-[#24221F] pt-2"
            >
              <span>Back to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#77716A] block">
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
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:bg-white focus:outline-none focus:border-[#A66A4C] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-full bg-[#24221F] hover:bg-[#A66A4C] active:scale-[0.99] disabled:opacity-50 text-[#F5F2EC] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm mt-2"
            >
              {submitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Reset Instructions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-2 text-center text-xs text-[#77716A] border-t border-[#E2DBD0]">
          <Link
            to="/login"
            className="font-semibold text-[#24221F] hover:text-[#A66A4C] inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
