import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SidePanel from './components/ui/SidePanel';
import ScrollToTop from './components/utils/ScrollToTop';
import AdminRoute from './components/utils/AdminRoute';

import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Catalog from './pages/Catalog';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminDashboard from './pages/AdminDashboard';

import NotFoundPage from './pages/NotFoundPage';

import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AuthProvider>
      <CurrencyProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-[#050507] text-gray-200 font-sans flex flex-col">
          <Header 
            onOpenCart={() => setIsCartOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/producto/:sku" element={<ProductDetail />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          
          <Footer />

          <AnimatePresence>
            {isCartOpen && (
              <SidePanel 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                title="MI CARRITO"
              />
            )}
          </AnimatePresence>
        </div>
      </Router>
    </CurrencyProvider>
    <Toaster 
         richColors 
         toastOptions={{
            style: {
              width: 'fit-content',   
              minWidth: 'auto',        
              paddingRight: '30px',
            },
          }}
         position="bottom-right" 
         theme="dark" 
         closeButton
    />
  </AuthProvider>
  );
}