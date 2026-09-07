import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SearchProvider } from './context/SearchContext';
import RootLayout from './layouts/RootLayout';

// Customer Storefront Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';

// Customer Ecommerce Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import Profile from './pages/Account/Profile';
import Addresses from './pages/Account/Addresses';

// Customer Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Protected Admin Suite
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminOrders from './pages/Admin/Orders';
import AdminOrderDetails from './pages/Admin/Orders/OrderDetails';
import AdminPayments from './pages/Admin/Payments';
import AdminProducts from './pages/Admin/Products';
import AdminCategories from './pages/Admin/Categories';
import AdminBrands from './pages/Admin/Brands';
import AdminInventory from './pages/Admin/Inventory';
import AdminCustomers from './pages/Admin/Customers';
import AdminCustomerDetails from './pages/Admin/Customers/CustomerDetails';
import AdminFeedback from './pages/Admin/Feedback';
import AdminSettings from './pages/Admin/Settings';

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
                  {/* Public Administrator Login */}
                  <Route path="admin/login" element={<AdminLogin />} />

                  {/* Protected Enterprise Admin Area */}
                  <Route
                    path="admin"
                    element={
                      <AdminRoute>
                        <AdminLayout />
                      </AdminRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="orders/:orderId" element={<AdminOrderDetails />} />
                    <Route path="payments" element={<AdminPayments />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="brands" element={<AdminBrands />} />
                    <Route path="inventory" element={<AdminInventory />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="customers/:userId" element={<AdminCustomerDetails />} />
                    <Route path="feedback" element={<AdminFeedback />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="settings/shipping" element={<AdminSettings />} />
                  </Route>

                  {/* Customer Storefront (Root Layout) */}
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
