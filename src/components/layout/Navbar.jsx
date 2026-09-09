import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ArrowUpRight,
  Package,
  MapPin,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import Logo from '../common/Logo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSearch } from '../../context/SearchContext';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Collection', path: '/products' },
  { name: 'Categories', path: '/categories' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { totalItemsCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { openSearch } = useSearch();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close account dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setAccountDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-[#F5F2EC]/92 backdrop-blur-md border-b border-[#E2DBD0] py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
            : isHome
            ? 'bg-transparent py-5 md:py-7'
            : 'bg-[#F5F2EC]/95 backdrop-blur-md border-b border-[#E2DBD0]/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo */}
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Center: Editorial Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-300 relative py-1 ${
                      isActive
                        ? 'text-[#24221F] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#A66A4C]'
                        : 'text-[#77716A] hover:text-[#24221F]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right: Actions (Search, Wishlist, Cart, User / Login) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Trigger */}
              <button
                onClick={openSearch}
                className="flex items-center gap-2 p-2 rounded-full text-[#77716A] hover:text-[#24221F] hover:bg-[#EAE4DA]/50 transition-colors text-xs cursor-pointer"
                title="Search product items (⌘K)"
                aria-label="Search"
              >
                <Search className="w-4 h-4 stroke-[1.8]" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="relative p-2 rounded-full text-[#77716A] hover:text-[#24221F] hover:bg-[#EAE4DA]/50 transition-colors"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 stroke-[1.8]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#A66A4C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative p-2 rounded-full text-[#24221F] hover:text-[#A66A4C] hover:bg-[#EAE4DA]/50 transition-colors cursor-pointer"
                aria-label="Shopping Cart"
                title="Cart"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
                {totalItemsCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#24221F] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Auth / Account Menu */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#EAE4DA]/60 hover:bg-[#EAE4DA] text-[#24221F] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    aria-label="User Account"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline max-w-[90px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-[#77716A]" />
                  </button>

                  <AnimatePresence>
                    {accountDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-[#F5F2EC] rounded-2xl shadow-xl border border-[#E2DBD0] py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-2.5 border-b border-[#E2DBD0] bg-[#EAE4DA]/40">
                          <p className="text-xs font-serif font-bold text-[#24221F] truncate">{user?.name}</p>
                          <p className="text-[11px] text-[#77716A] truncate">{user?.email}</p>
                        </div>

                        <div className="py-1">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#A66A4C] hover:bg-[#EAE4DA]/60 transition-colors"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-[#A66A4C]" />
                              <span>Admin Console</span>
                            </Link>
                          )}
                          <Link
                            to="/account"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#24221F] hover:bg-[#EAE4DA]/60 transition-colors"
                          >
                            <User className="w-3.5 h-3.5 text-[#77716A]" />
                            <span>My Account</span>
                          </Link>
                          <Link
                            to="/my-orders"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#24221F] hover:bg-[#EAE4DA]/60 transition-colors"
                          >
                            <Package className="w-3.5 h-3.5 text-[#77716A]" />
                            <span>My Orders</span>
                          </Link>
                          <Link
                            to="/wishlist"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#24221F] hover:bg-[#EAE4DA]/60 transition-colors"
                          >
                            <Heart className="w-3.5 h-3.5 text-[#77716A]" />
                            <span>Wishlist</span>
                          </Link>
                          <Link
                            to="/account/addresses"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#24221F] hover:bg-[#EAE4DA]/60 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-[#77716A]" />
                            <span>Saved Addresses</span>
                          </Link>
                        </div>

                        <div className="border-t border-[#E2DBD0] pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-700 hover:bg-red-50 transition-colors cursor-pointer text-left"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-full border border-[#24221F] text-[#24221F] hover:bg-[#24221F] hover:text-[#F5F2EC] text-[11px] font-semibold uppercase tracking-wider transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-[#24221F] hover:text-[#A66A4C] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 stroke-[1.8]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#24221F]/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#F5F2EC] shadow-2xl flex flex-col justify-between p-7 z-10 border-l border-[#E2DBD0]"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#E2DBD0]">
                  <Logo />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-[#77716A] hover:text-[#24221F] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openSearch();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#EAE4DA]/60 text-[#77716A] text-xs font-medium uppercase tracking-wider"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search collection...</span>
                  </button>
                </div>

                <nav className="mt-8 flex flex-col space-y-4">
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between py-2 text-base font-serif transition-colors ${
                          isActive ? 'text-[#A66A4C] font-bold italic' : 'text-[#24221F]'
                        }`
                      }
                    >
                      <span className="text-xl">{link.name}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-40" />
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-[#E2DBD0] space-y-2.5">
                  <Link
                    to="/wishlist"
                    className="flex items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-[#24221F]"
                  >
                    <span>Wishlist ({wishlistCount})</span>
                    <Heart className="w-4 h-4 text-[#A66A4C]" />
                  </Link>

                  {isAuthenticated ? (
                    <>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-[#A66A4C]"
                        >
                          <span>Admin Console</span>
                          <ShieldCheck className="w-4 h-4 text-[#A66A4C]" />
                        </Link>
                      )}
                      <Link
                        to="/my-orders"
                        className="flex items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-[#24221F]"
                      >
                        <span>My Orders</span>
                        <Package className="w-4 h-4 text-[#77716A]" />
                      </Link>
                      <Link
                        to="/account"
                        className="flex items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-[#24221F]"
                      >
                        <span>My Account ({user?.name})</span>
                        <User className="w-4 h-4 text-[#77716A]" />
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block w-full text-center py-3 rounded-full bg-[#24221F] text-white text-xs font-semibold uppercase tracking-wider mt-4"
                    >
                      Sign In / Register
                    </Link>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-[#E2DBD0] text-xs text-[#77716A]">
                <p className="font-bold text-[#24221F] uppercase tracking-wider text-[11px]">
                  BYTECART PRIVATE LIMITED
                </p>
                <p>Anna Nagar, Chennai – 600040</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
