import React from 'react';
import { ShoppingCart, Menu, User, ChevronDown } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import TechLogo from '../ui/Logo';
import SearchBar from '../ui/SearchBar';

const navLinks = [
    { label: "PC ARMADAS", value: "COMPUTADORAS" },
    { label: "NOTEBOOKS", value: "NOTEBOOKS" },
    { label: "MONITORES", value: "MONITORES" },
    { label: "IMPRESORAS", value: "IMPRESORAS" } 
];

export default function Header({ onOpenCart }) {
  return (
    <header className="sticky top-0 z-40 bg-[#050507]/95 border-b border-white/10 shadow-xl backdrop-blur-sm flex flex-col">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
            <button className="lg:hidden text-white cursor-pointer"><Menu /></button> 
            <Link to="/" className="block cursor-pointer">
                <TechLogo />
            </Link>
        </div>

        <div className="hidden md:block flex-1 mx-8">
           <SearchBar />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 justify-end">
          <button className="p-2 text-gray-400 hover:text-white transition-colors hidden sm:block cursor-pointer">
            <User size={20} />
          </button>
          
          <button 
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg transition-all group border border-cyan-500/20 cursor-pointer"
          >
            <ShoppingCart size={18} />
            <span className="font-bold text-sm hidden sm:block">CARRITO</span>
          </button>
        </div>
      </div>

      <div className="hidden lg:block border-t border-white/5 bg-[#0a0a0f]">
          <div className="container mx-auto px-4">
              <nav className="flex items-center justify-center gap-8 py-2">
                  {navLinks.map((item, i) => (
                      <Link 
                        key={i} 
                        to={`/catalogo?category=${item.value}`} 
                        className="text-[11px] font-bold text-gray-400 hover:text-cyan-400 transition-colors tracking-widest cursor-pointer flex items-center gap-1 group"
                      >
                          {item.label}
                          <ChevronDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:rotate-180 duration-300"/>
                      </Link>
                  ))}

              </nav>
          </div>
      </div>
    </header>
  );
}