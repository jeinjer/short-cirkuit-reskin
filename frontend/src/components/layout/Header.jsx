import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import TechLogo from '../ui/Logo';
import SearchBar from '../ui/SearchBar';
import DesktopNav from './header/DesktopNav';
import UserMenuDesktop from './header/UserMenuDesktop';
import MobileMenu from './header/MobileMenu';
import CartButton from './header/CartButton';

export default function Header({ onOpenCart }) {
  const location = useLocation();
  const hiddenRoutes = ['/login', '/registro', '/forgot-password', '/reset-password'];
  
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <header className="sticky top-0 z-40 bg-[#050507]/95 border-b border-white/10 shadow-xl backdrop-blur-sm flex flex-col">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">

        <div className="flex items-center gap-4">
            <Link to="/" className="block cursor-pointer">
                <TechLogo />
            </Link>
        </div>

        <div className="hidden md:block flex-1 mx-8">
           <SearchBar />
        </div>

        <div className="flex items-center gap-3 sm:gap-4 justify-end">
          <UserMenuDesktop />
          <CartButton onClick={onOpenCart} />
          <MobileMenu />
        </div>
      </div>

      <DesktopNav />
    </header>
  );
}