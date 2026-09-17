// src/App.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactCard from './components/ContactCard';
//import PopupPoster from './components/PopupPoster';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import PageLoader from './components/PageLoader';
import usePageLoader from './hooks/usePageLoader';
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Login from './pages/Login';
import UpdatesPage from './pages/UpdatesPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import RefundPolicy from './pages/RefundPolicy';
import OrderConfirmation from './pages/OrderConfirmation';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsOfService from './pages/TermsOfService';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import ValentineBundle from './components/ValentineBundle';
import EasterSale from './pages/Eastersale';

// ─── AppContent must be a child of BrowserRouter so useLocation works ────────
const AppContent = () => {
  const location = useLocation();
  const loading  = usePageLoader(900); // 900ms hold time

  return (
    <>
      {/* Mounts a fresh loader on every route change via key prop */}
      {loading && <PageLoader key={location.pathname} duration={900} />}

      <ScrollToTop />

      <main className="pt-[80px] text-tertiary relative min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/"                           element={<Home />} />
            <Route path="/collections"                element={<Collections />} />
            <Route path="/collections?category=:category" element={<Collections />} />
            <Route path="/product"                    element={<ProductDetail />} />
            <Route path="/cart"                       element={<Cart />} />
            <Route path="/about"                      element={<About />} />
            <Route path="/login"                      element={<Login />} />
            <Route path="/updates"                    element={<UpdatesPage />} />
            <Route path="/checkout"                   element={<Checkout />} />
            <Route path="/order-success"              element={<OrderSuccess />} />
            <Route path="/refund"                     element={<RefundPolicy />} />
            <Route path="/order-confirmation"         element={<OrderConfirmation />} />
            <Route path="/valentine-bundle"           element={<ValentineBundle />} />
            <Route path="/easter-sale"                element={<EasterSale />} />
            <Route path="/privacy-policy"             element={<PrivacyPolicy />} />
            <Route path="/shipping-policy"            element={<ShippingPolicy />} />
            <Route path="/terms-of-service"           element={<TermsOfService />} />
            <Route path="/admin"                      element={<AdminDashboard />} />
          </Routes>
        </div>
        <Footer />
        <ContactCard />
        <CookieConsent />
      </main>
    </>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}