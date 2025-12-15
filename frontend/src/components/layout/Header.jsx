import React, { useState } from 'react';
import { ShoppingCart, Menu, User, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import TechLogo from '../ui/Logo';
import SearchBar from '../ui/SearchBar';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
    { label: "PC ARMADAS", value: "COMPUTADORAS" },
    { label: "NOTEBOOKS", value: "NOTEBOOKS" },
    { label: "MONITORES", value: "MONITORES" },
    { label: "IMPRESORAS", value: "IMPRESORAS" } 
];

export default function Header({ onOpenCart }) {
  const { isAuthenticated, user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

        <div className="flex items-center gap-3 sm:gap-4 justify-end">
          
          {!isAuthenticated ? (
            <Link 
                to="/login" 
                className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 px-3 py-2 rounded-lg transition-all group cursor-pointer h-[42px]"
            >
                <div className="flex flex-col items-end leading-none">
                    <span className="text-[10px] font-medium text-gray-200 uppercase tracking-wider">
                    Ingresar
                    </span>
                </div>
                
                <div className="p-1 rounded-full text-cyan-400 bg-cyan-500/10 transition-colors">
                    <User size={18} />
                </div>
            </Link>
          ) : (
            <div className="relative hidden sm:block">
                <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 bg-cyan-900/10 border border-cyan-500/20 hover:bg-cyan-900/20 px-3 py-2 rounded-lg transition-all group cursor-pointer h-[42px]"
                >
                    <div className="flex flex-col items-end leading-none">
                        <span className="text-[10px] font-medium text-cyan-400/70 uppercase tracking-wider">
                            Hola,
                        </span>
                        <span className="text-[12px] font-bold text-cyan-100 uppercase tracking-wide truncate max-w-[100px]">
                            {user?.name?.split(' ')[0] || 'Usuario'} 
                        </span>
                    </div>
                    
                    <div className="p-1 rounded-full text-white bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                        <User size={18} />
                    </div>
                </button>

                {isUserMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                        
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0f] border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">                            <div className="p-1">
                                <Link 
                                    to="/perfil" 
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <LayoutDashboard size={16} className="text-cyan-400"/>
                                    Mi perfil
                                </Link>
                                
                                <button 
                                    onClick={() => {
                                        logout();
                                        setIsUserMenuOpen(false);
                                    }}
                                    className="cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                                >
                                    <LogOut size={16} />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
          )}

          <Link to={isAuthenticated ? "/perfil" : "/login"} className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
             <User size={20} className={isAuthenticated ? "text-cyan-400" : ""} />
          </Link>
          
          <button 
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2 h-[42px] rounded-lg transition-all group border border-cyan-500/20 cursor-pointer"
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