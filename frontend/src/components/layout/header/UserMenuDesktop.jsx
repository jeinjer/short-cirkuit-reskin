import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserMenuDesktop() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = user?.role === 'ADMIN';
  
  const menuRef = useRef(null);

  useEffect(() => {

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);


  const menuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } }
  };

  return (
    <div className="hidden md:block relative" ref={menuRef}>
      <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 border px-3 py-2 rounded-lg transition-all group cursor-pointer h-[42px] ${isAuthenticated ? 'bg-cyan-900/10 border-cyan-500/20 hover:bg-cyan-900/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
      >
          {!isAuthenticated ? (
              <>
                  <div className="flex flex-col items-end leading-none">
                      <span className="text-[12px] font-bold text-gray-200 uppercase tracking-wide">Ingresar</span>
                  </div>
                  <div className="p-1 rounded-full text-cyan-400 bg-cyan-500/10">
                      <User size={18} />
                  </div>
              </>
          ) : (
              <>
                  <div className="flex flex-col items-end leading-none">
                      <span className="text-[10px] font-medium text-cyan-400/70 uppercase tracking-wider">Hola,</span>
                      <span className="text-[12px] font-bold text-cyan-100 uppercase tracking-wide truncate max-w-[100px]">
                          {user?.name?.split(' ')[0]?.slice(0, 15)}
                      </span>
                  </div>
                  <div className="p-1 rounded-full text-white bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                      <User size={18} />
                  </div>
              </>
          )}
      </button>

      <AnimatePresence>
        {isOpen && (
            <motion.div 
              className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0f] border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl z-50 overflow-hidden"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
                <div className="p-1.5 space-y-1">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)} className="flex uppercase items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                <LogIn size={16} className="text-cyan-400"/> Iniciar Sesión
                            </Link>
                            <Link to="/registro" onClick={() => setIsOpen(false)} className="flex uppercase items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                <UserPlus size={16} className="text-purple-400"/> Registrarse
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="px-3 py-2 border-b border-white/5 mb-1">
                                <p className="text-xs text-gray-500 uppercase font-bold">Mi Cuenta</p>
                            </div>
                            <Link to="/perfil" onClick={() => setIsOpen(false)} className="flex uppercase items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                <User size={16} className="text-cyan-400"/> Ver Perfil
                            </Link>
                            
                            {isAdmin && (
                                <Link to="/admin" onClick={() => setIsOpen(false)} className="flex uppercase items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:text-wihte hover:bg-white/5 rounded-lg transition-colors">
                                    <LayoutDashboard size={16} /> Panel de Admin
                                </Link>
                            )}
                            
                            <div className="h-px bg-white/5 my-1"></div>
                            <button onClick={() => { logout(); setIsOpen(false); }} className="flex uppercase items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
                                <LogOut size={16} /> Cerrar Sesión
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