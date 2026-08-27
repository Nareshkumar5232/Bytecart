import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SearchProvider } from './context/SearchContext';
import RootLayout from './layouts/RootLayout';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';

// New Customer Ecommerce Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import Profile from './pages/Account/Profile';
import Addresses from './pages/Account/Addresses';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/:slug" element={<ProductDetail />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />

                    {/* Ecommerce Routes */}
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="order-success/:orderId" element={<OrderSuccess />} />
                    <Route path="my-orders" element={<MyOrders />} />
                    <Route path="my-orders/:orderId" element={<OrderDetails />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="account" element={<Account />} />
                    <Route path="account/profile" element={<Profile />} />
                    <Route path="account/addresses" element={<Addresses />} />

                    {/* Auth Routes */}
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />

                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
