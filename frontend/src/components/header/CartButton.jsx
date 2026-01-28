import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CartButton({ onClick }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  if (!isAdmin) return null;

  return (
    <button 
      onClick={onClick}
      className="group relative flex items-center justify-center w-[42px] h-[42px] bg-cyan-900/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300"
      style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
      title="Carrito"
    >
      <ShoppingCart size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />
      
      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_5px_#22d3ee] animate-pulse" />
    </button>
  );
}