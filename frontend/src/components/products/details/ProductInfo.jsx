import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { toast } from 'sonner';
import { getVisiblePriceArs } from '../../../utils/productPricing';

export default function ProductInfo({ product, formatPrice, isAdmin, onAskProductInquiry, inquirySubmitted }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const isCliente = user?.role === 'CLIENTE';
  const canBuy = isAuthenticated && isCliente && !isAdmin;
  const hasStock = (product.quantity || 0) > 0;
  const visiblePrice = getVisiblePriceArs(product, isAdmin);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!isCliente) return toast.error('Solo clientes pueden comprar desde el carrito');
    if (!hasStock) return toast.error('Este producto no tiene stock disponible');
    await addToCart(product.id, 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col gap-5 sm:gap-6"
    >
      <div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
          <span className="px-3 py-1 bg-cyan-950/30 border border-cyan-500/30 rounded font-mono font-bold text-cyan-400 uppercase tracking-widest text-xs sm:text-sm">
            {product.category}
          </span>
          <span className="text-gray-500 font-cyber font-bold tracking-widest uppercase border-b border-white/10 pb-0.5 text-xs sm:text-sm">
            {product.brand}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-cyber leading-[0.95] text-white uppercase tracking-tight mb-2">
          {product.name}
        </h1>
      </div>

      <div className="py-5 sm:py-6 border-y border-white/5 bg-white/2 -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:border-none">
        <span className=" text-gray-500 font-mono block mb-1 text-xs sm:text-sm">PRECIO FINAL*</span>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter break-words">
            {formatPrice(visiblePrice)}
          </span>
        </div>
        <p className={`mt-3 text-sm font-mono ${hasStock ? 'text-cyan-300' : 'text-red-300'}`}>
          {hasStock ? `Stock disponible: ${product.quantity}` : 'Sin stock'}
        </p>
        <p className="mt-1 text-[11px] text-gray-500">* El precio final no incluye envio.</p>
      </div>

      <div className="flex flex-col gap-3">
        {canBuy ? (
          <button
            onClick={handleAddToCart}
            disabled={!hasStock}
            className={`group relative w-full h-14 sm:h-16 transition-all duration-300 rounded-lg overflow-hidden flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.2)] ${
              hasStock ? 'bg-cyan-600 hover:bg-cyan-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] hover:-translate-y-1' : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            {hasStock && <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-size-[250%_250%] animate-[shimmer_2s_infinite]" />}
            <ShoppingCart className="relative z-10 text-white" size={20} />
            <span className="relative z-10 font-black font-cyber text-sm sm:text-xl tracking-wider sm:tracking-widest uppercase">
              {hasStock ? 'Agregar al Carrito' : 'Sin stock'}
            </span>
          </button>
        ) : !isAdmin ? (
          <button
            onClick={handleAddToCart}
            className="group relative w-full h-14 sm:h-16 bg-cyan-600 hover:bg-cyan-500 transition-all duration-300 rounded-lg overflow-hidden flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
          >
            <ShoppingCart className="relative z-10 text-white" size={20} />
            <span className="relative z-10 font-black font-cyber text-xs sm:text-xl tracking-wider sm:tracking-widest uppercase">
              {isAuthenticated ? 'Agregar al Carrito' : 'Inicia sesion para comprar'}
            </span>
          </button>
        ) : null}

        {canBuy && (
          <button
            onClick={onAskProductInquiry}
            className={`w-full h-12 border rounded-lg flex items-center justify-center gap-3 transition-all font-mono font-bold text-xs tracking-wider uppercase ${
              inquirySubmitted
                ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/30'
                : 'bg-cyan-900/10 hover:bg-cyan-900/30 border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white'
            }`}
          >
            <MessageSquare size={16} />
            {inquirySubmitted ? 'Consulta enviada' : 'Consultar sobre este producto'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
