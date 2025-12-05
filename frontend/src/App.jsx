import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import SidePanel from './components/ui/SidePanel';
import ScrollToTop from './components/utils/ScrollToTop';
import { CurrencyProvider } from './context/CurrencyContext';
import Catalog from './pages/Catalog';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
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
  );
}