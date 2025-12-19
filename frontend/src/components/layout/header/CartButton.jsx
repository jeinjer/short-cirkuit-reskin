import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function CartButton({ onClick }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  if (!isAdmin) return null;

  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2 h-[42px] rounded-lg transition-all group border border-cyan-500/20 cursor-pointer"
      title="Administrar Pedidos"
    >
      <ShoppingCart size={18} />
      <span className="font-bold text-[12px] text-sm hidden lg:block">CARRITO</span>
    </button>
  );
}