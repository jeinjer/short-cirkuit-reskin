import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogIn, UserPlus, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserMenuDesktop() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = user?.role === 'ADMIN';
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="hidden md:block relative" ref={menuRef}>
      <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative cursor-pointer group flex items-center gap-3 pl-4 pr-3 py-1.5 h-[42px] border transition-all duration-300
            ${isAuthenticated 
               ? 'bg-[#0a0a0f] border-cyan-500/30 hover:border-cyan-400' 
               : 'bg-transparent border-white/10 hover:border-white/30 hover:bg-white/5'
            }
          `}
          style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
      >
          {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                  <span className="font-tech font-bold text-gray-300 uppercase tracking-wide group-hover:text-white">Ingresar</span>
                  <LogIn size={16} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
              </div>
          ) : (
              <>
                  <div className="flex flex-col items-end leading-none mr-1">
                      <span className="text-[9px] font-mono text-cyan-600 uppercase tracking-widest">Usuario</span>
                      <span className="font-tech font-bold text-lg text-white uppercase tracking-tight truncate max-w-[100px]">
                          {user?.name?.split(' ')[0]}
                      </span>
                  </div>
                  <div className="h-8 w-8 bg-cyan-900/15 border border-cyan-500/35 flex items-center justify-center rounded-sm overflow-hidden backdrop-blur-sm">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover opacity-85" />
                      ) : (
                        <User size={16} className="text-cyan-400/90" />
                      )}
                  </div>
                  <ChevronDown size={12} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </>
          )}
      </button>

      <AnimatePresence>
        {isOpen && (
            <motion.div 
              className="absolute right-0 top-full mt-2 w-64 bg-[#050507] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
                <div className="h-1 w-full bg-linear-to-r from-cyan-600 to-purple-600" />
                
                <div className="p-2 space-y-1">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                <LogIn size={18} className="text-cyan-500"/> 
                                <span className="font-tech font-bold text-lg">ACCEDER</span>
                            </Link>
                            <Link to="/registro" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                <UserPlus size={18} className="text-purple-500"/> 
                                <span className="font-tech font-bold text-lg">CREAR CUENTA</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="px-4 py-2 border-b border-white/5 mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-full overflow-hidden border border-cyan-500/30 bg-cyan-900/15">
                                    {user?.avatar ? (
                                      <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover opacity-85" />
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center">
                                        <User size={13} className="text-cyan-400/90" />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-gray-500 font-mono uppercase tracking-widest">Panel de Control</p>
                                </div>
                            </div>
                            
                            <Link to="/perfil" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/5 transition-colors group">
                                <LayoutDashboard size={16} className="text-gray-500 group-hover:text-cyan-400"/> 
                                <span className="font-tech font-medium uppercase">Mi Perfil</span>
                            </Link>

                            {isAdmin && (
                                <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-cyan-500/80 hover:text-cyan-400 hover:bg-cyan-500/5 transition-colors group">
                                    <LayoutDashboard size={16} /> 
                                    <span className="font-tech font-medium uppercase">Panel de Admin</span>
                                </Link>
                            )}
                            
                            <div className="h-px bg-white/5 my-2 mx-2"></div>
                            
                            <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer">
                                <LogOut size={16} /> 
                                <span className="font-tech font-medium text-sm uppercase">Cerrar sesión</span>
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
