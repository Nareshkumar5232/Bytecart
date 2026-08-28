import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get('subject') || 'Custom Product Inquiry';
  const skuParam = searchParams.get('sku') || '';

  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: initialSubject,
    message: skuParam ? `Inquiry regarding product (${skuParam}). Please share specifications and delivery timelines.` : '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (searchParams.get('subject')) {
      setFormData((prev) => ({
        ...prev,
        subject: searchParams.get('subject'),
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      addToast('Thank you. Your inquiry has been received by our Chennai office.', 'success', 5000);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Custom Product Inquiry',
        message: '',
      });
    }, 500);
  };

  return (
    <div className="pt-28 md:pt-36 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
          Support & Inquiries
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#24221F] tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm sm:text-base text-[#77716A] leading-relaxed font-light">
          Whether you’re commissioning custom tech specifications, requesting component samples, or seeking electronics consultation for your setup, our team is here.
        </p>
      </div>

      {/* Main Grid: Details + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[#EAE4DA]/50 rounded-3xl p-8 sm:p-10 border border-[#E2DBD0] space-y-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A66A4C]">
                Corporate Headquarters
              </span>
              <h3 className="text-2xl font-serif text-[#24221F] mt-1">
                BYTECART PRIVATE LIMITED
              </h3>
            </div>

            <div className="space-y-6 text-xs text-[#77716A]">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <MapPin className="w-4 h-4 text-[#A66A4C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#24221F] block uppercase tracking-wider text-[11px]">
                    Registered Office & Headquarters
                  </span>
                  <address className="not-italic leading-relaxed text-[#77716A] mt-1">
                    Flat No. 2, Plot No. 1051, I Block,<br />
                    35th Street, 18th Main Road,<br />
                    Anna Nagar, Chennai – 600040,<br />
                    Tamil Nadu, India
                  </address>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3.5">
                <Mail className="w-4 h-4 text-[#A66A4C] shrink-0" />
                <div>
                  <span className="font-semibold text-[#24221F] block uppercase tracking-wider text-[11px]">
                    Email Inquiries
                  </span>
                  <a
                    href="mailto:bytecartpvtltd@gmail.com"
                    className="text-[#24221F] hover:text-[#A66A4C] transition-colors"
                  >
                    bytecartpvtltd@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3.5">
                <Phone className="w-4 h-4 text-[#A66A4C] shrink-0" />
                <div>
                  <span className="font-semibold text-[#24221F] block uppercase tracking-wider text-[11px]">
                    Office Telephone
                  </span>
                  <a
                    href="tel:04431544571"
                    className="text-[#24221F] hover:text-[#A66A4C] transition-colors"
                  >
                    044 3154 4571
                  </a>
                </div>
              </div>
            </div>

            {/* Direct CTAs */}
            <div className="pt-2 flex gap-3">
              <a
                href="mailto:bytecartpvtltd@gmail.com"
                className="flex-1 py-3 px-4 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-[#F5F2EC] text-xs font-semibold uppercase tracking-wider text-center transition-colors"
              >
                Email Us
              </a>
              <a
                href="tel:04431544571"
                className="flex-1 py-3 px-4 rounded-full border border-[#24221F] text-[#24221F] hover:bg-[#24221F] hover:text-white text-xs font-semibold uppercase tracking-wider text-center transition-colors"
              >
                Call Office
              </a>
            </div>
          </div>
        </div>

        {/* Right: Consultation Form */}
        <div className="lg:col-span-7">
          <div className="bg-[#EAE4DA]/30 rounded-3xl p-8 sm:p-12 border border-[#E2DBD0] space-y-6">
            <h3 className="text-2xl font-serif text-[#24221F]">
              Send an Inquiry
            </h3>

            {submitted && (
              <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#A66A4C] shrink-0 mt-0.5" />
                <div className="text-xs text-[#24221F]">
                  <p className="font-semibold">Inquiry Received</p>
                  <p className="text-[#77716A] mt-0.5">
                    Thank you. A member of our support team will respond within 24 hours.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-[#77716A] block">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Maya Ramesh"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:bg-white focus:outline-none focus:border-[#A66A4C] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-[#77716A] block">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:bg-white focus:outline-none focus:border-[#A66A4C] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-medium uppercase tracking-wider text-[#77716A] block">
                    Contact Phone *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98400 12345"
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:bg-white focus:outline-none focus:border-[#A66A4C] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-medium uppercase tracking-wider text-[#77716A] block">
                    Interest / Category
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:bg-white focus:outline-none focus:border-[#A66A4C] transition-all cursor-pointer"
                  >
                    <option value="Custom Product Inquiry">Custom Product Inquiry</option>
                    <option value="Laptops & Computers">Laptops & Computers</option>
                    <option value="PC Components & Storage">PC Components & Storage</option>
                    <option value="Monitors & Accessories">Monitors & Accessories</option>
                    <option value="Corporate & Bulk Inquiries">Corporate & Bulk Inquiries</option>
                    <option value="Enterprise & Institutional Solutions">Enterprise & Institutional Solutions</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-[#77716A] block">
                  Message / Custom Requirements *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your hardware requirements, system specifications, or questions..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#F5F2EC] border border-[#E2DBD0] text-xs text-[#24221F] focus:bg-white focus:outline-none focus:border-[#A66A4C] transition-all resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-full bg-[#24221F] hover:bg-[#A66A4C] active:scale-[0.99] disabled:opacity-50 text-[#F5F2EC] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
