import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, User, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 md:hidden">

            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            <div className="absolute inset-0 flex justify-end pointer-events-none">
                <motion.div 
                  className="w-[85%] max-w-sm h-full bg-[#0a0a0f] border-l border-white/10 shadow-2xl flex flex-col pointer-events-auto"
                  onClick={(e) => e.stopPropagation()} 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                >
                    
                    <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#13131a] shrink-0 h-[70px]">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Menú</span>
                        <button 
                          onClick={handleClose}
                          className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                        {!isAuthenticated ? (
                            <div className="grid grid-cols-2 gap-3">
                                <Link to="/login" onClick={handleClose} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 text-gray-200 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all active:scale-95">
                                    <LogIn size={24} className="text-cyan-400"/> 
                                    <span className="font-bold uppercase text-xs">Ingresar</span>
                                </Link>
                                <Link to="/registro" onClick={handleClose} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 text-gray-200 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all active:scale-95">
                                    <UserPlus size={24} className="text-purple-400"/> 
                                    <span className="font-bold uppercase text-xs">Registrarse</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white shrink-0">
                                        <User size={20}/>
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">Bienvenido</p>
                                        <p className="text-white font-bold text-lg leading-none truncate">{user.name}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-1">
                                    <Link to="/perfil" onClick={handleClose} className="flex items-center justify-between p-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        <span className="flex uppercase items-center gap-2"><LayoutDashboard size={16}/> Mi Perfil</span>
                                        <ChevronRight size={14} className="text-gray-600"/>
                                    </Link>
                                    {isAdmin && (
                                        <Link to="/admin" onClick={handleClose} className="flex items-center justify-between p-2 text-sm text-yellow-200 hover:text-yellow-100 hover:bg-yellow-500/10 rounded-lg transition-colors">
                                            <span className="flex uppercase items-center gap-2"><LayoutDashboard size={16}/> Panel Admin</span>
                                            <ChevronRight size={14} className="text-yellow-500/50"/>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}

                        <hr className="border-white/5" />

                        <nav className="flex flex-col gap-1">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-2">Categorías</p>
                            {[
                                { label: "PC Armadas", path: "/catalogo?category=COMPUTADORAS" },
                                { label: "Notebooks", path: "/catalogo?category=NOTEBOOKS" },
                                { label: "Monitores", path: "/catalogo?category=MONITORES" },
                                { label: "Impresoras", path: "/catalogo?category=IMPRESORAS" }
                            ].map((link, idx) => (
                                <Link 
                                    key={idx}
                                    to={link.path} 
                                    onClick={handleClose}
                                    className="flex items-center justify-between p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all active:bg-white/10"
                                >
                                    <span className="font-medium">{link.label}</span>
                                    <ChevronRight size={16} className="text-gray-600"/>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {isAuthenticated && (
                        <div className="p-5 border-t border-white/5 bg-[#0a0a0f] shrink-0">
                            <button 
                                onClick={() => { logout(); handleClose(); }} 
                                className="flex items-center uppercase justify-center gap-2 w-full p-3 text-red-400 font-bold bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/30 rounded-xl transition-all cursor-pointer"
                            >
                                <LogOut size={18}/> Cerrar Sesión
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button 
        className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer relative z-50"
        onClick={() => setIsOpen(true)}
      >
          <Menu size={24} />
      </button>

      {createPortal(menuContent, document.body)}
    </>
  );
}