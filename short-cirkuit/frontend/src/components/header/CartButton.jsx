import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useCart } from '../../context/useCart';
import { useNavigate } from 'react-router-dom';

export default function CartButton({ onClick }) {
  const { user, isAuthenticated } = useAuth();
  const { summary } = useCart();
  const navigate = useNavigate();
  const canUseCart = isAuthenticated && user?.role === 'CLIENTE';

  if (!canUseCart) return null;

  return (
    <button 
      onClick={() => {
        if (!isAuthenticated) return navigate('/login');
        onClick();
      }}
      className="group relative flex items-center justify-center w-[42px] h-[42px] bg-cyan-900/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300"
      style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
      title="Carrito"
    >
      <ShoppingCart size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />

      {summary.totalItems > 0 ? (
        <div className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-cyan-500 text-[10px] font-black text-black flex items-center justify-center shadow-[0_0_8px_#22d3ee]">
          {summary.totalItems}
        </div>
      ) : (
        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_5px_#22d3ee] animate-pulse" />
      )}
    </button>
  );
}
