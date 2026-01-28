import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import SidePanel from './components/others/SidePanel';
import ScrollToTop from './components/utils/ScrollToTop';
import AdminRoute from './components/utils/AdminRoute';
import ClientRoute from './components/utils/ClientRoute';

import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Catalog from './pages/Catalog';
import ContactPage from './pages/Contact';
import ResetPasswordPage from './pages/ResetPassword';
import ForgotPasswordPage from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';

import NotFoundPage from './pages/404';

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

              <Route element={<ClientRoute />}>
                <Route path="/contacto" element={<ContactPage />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
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