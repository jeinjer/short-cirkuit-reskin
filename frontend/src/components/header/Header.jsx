import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeaderLogo from './LogoHeader';
import SearchBar from './SearchBar';
import UserMenuDesktop from './UserMenuDesktop';
import MobileMenu from './MobileMenu';
import CartButton from './CartButton';

export default function Header({ onOpenCart }) {
  const location = useLocation();
  const hiddenRoutes = ['/login', '/registro', '/forgot-password', '/reset-password'];
  
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <header className="sticky top-0 z-40 bg-[#050507]/80 border-b border-white/5 shadow-2xl backdrop-blur-md">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-900/50 to-transparent" />
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-6">
        <div className="shrink-0">
          <Link to="/">
            <HeaderLogo />
          </Link>
        </div>

        <div className="hidden md:block flex-1 max-w-2xl mx-auto">
           <SearchBar />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <UserMenuDesktop />
            <CartButton onClick={onOpenCart} />
          <MobileMenu />
        </div>
        
      </div>
    </header>
  );
}