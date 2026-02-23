import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import SidePanel from './components/others/SidePanel';
import ScrollToTop from './components/utils/ScrollToTop';
import AppProviders from './components/app/AppProviders';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AppProviders>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-[#050507] text-gray-200 font-sans flex flex-col overflow-x-clip">
          <Header
            onOpenCart={() => setIsCartOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className="flex-1">
            <AppRoutes />
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
    </AppProviders>
  );
}
