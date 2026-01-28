import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, FileOutput, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function ProductInfo({ product, formatPrice, isAdmin }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const isCliente = user?.role === 'CLIENTE';
  console.log("ROL: ", user?.role);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col gap-6"
    >
      <div>
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 bg-cyan-950/30 border border-cyan-500/30 rounded font-mono font-bold text-cyan-400 uppercase tracking-widest">
            {product.category}
          </span>
          <span className="text-gray-500 font-cyber font-bold tracking-widest uppercase border-b border-white/10 pb-0.5">
            {product.brand}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black font-cyber leading-[0.95] text-white uppercase tracking-tight mb-2">
          {product.name}
        </h1>
      </div>

      <div className="py-6 border-y border-white/5 bg-white/2 -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:border-none">
        <span className=" text-gray-500 font-mono block mb-1">PRECIO FINAL</span>
        <div className="flex items-baseline gap-3">
          <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {isAuthenticated && isCliente && !isAdmin ? (
          <button 
            onClick={() => navigate('/contacto', { state: { product } })}
            className="group relative w-full h-16 bg-cyan-600 hover:bg-cyan-500 transition-all duration-300 rounded-lg overflow-hidden flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-size-[250%_250%] animate-[shimmer_2s_infinite]" />
            <MessageSquare className="relative z-10 text-white" size={24} />
            <span className="relative z-10 font-black font-cyber text-xl tracking-widest uppercase">
              Consultar a un asesor
            </span>
          </button>
        ) : !isAdmin ? (

          <button 
            onClick={() => !isAuthenticated && navigate('/login')}
            className="group relative w-full h-16 bg-cyan-600 hover:bg-cyan-500 transition-all duration-300 rounded-lg overflow-hidden flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
          >
            <ShoppingCart className="relative z-10 text-white" size={24} />
            <span className="relative z-10 font-black font-cyber text-xl tracking-widest uppercase">
              {isAuthenticated ? 'Agregar al Carrito' : 'Inicia sesión para comprar'}
            </span>
          </button>
        ) : null}

        {isAdmin && (
          <button className="w-full h-12 bg-purple-900/10 hover:bg-purple-900/30 border border-purple-500/30 hover:border-purple-500 text-purple-400 hover:text-white rounded-lg flex items-center justify-center gap-3 transition-all font-mono font-bold text-xs tracking-wider uppercase">
            <FileOutput size={16} />
            Generar Cotización Inversa
          </button>
        )}
      </div>
    </motion.div>
  );
}