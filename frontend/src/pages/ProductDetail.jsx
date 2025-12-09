import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Shield, Truck } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function ProductDetail() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { formatPrice, dolarRate } = useCurrency();

  useEffect(() => {
    if (!sku) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${sku}`);
        if (!res.ok) throw new Error('Producto no encontrado');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [sku]);

  if (loading) return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center text-cyan-500">
      <div className="animate-pulse">Cargando...</div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center text-white">
      Producto no encontrado
    </div>
  );

  const specs = Object.entries(product.specs || {}).filter(([_, v]) => v !== null && v !== '');

  return (
    <div className="min-h-screen bg-[#050507] pt-24 pb-12 px-4 font-sans">
      <div className="container mx-auto max-w-6xl">
        
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition-colors cursor-pointer w-fit group bg-transparent border-none outline-none"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> 
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="bg-[#13131a] rounded-3xl p-8 border border-white/5 flex items-center justify-center relative overflow-hidden group min-h-[400px]"
          >
             <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent opacity-50"></div>
             <img 
               src={product.imageUrl || "https://pngimg.com/d/question_mark_PNG99.png"} 
               alt={product.name} 
               className="w-full h-full max-h-[500px] object-contain relative z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
             />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col w-full">
             <div className="flex items-center gap-2 mb-3">
               <span className="text-cyan-400 font-mono text-xs uppercase tracking-wider px-2 py-1 bg-cyan-900/20 rounded border border-cyan-500/30">
                 {product.category}
               </span>
               <span className="text-gray-500 text-xs font-mono uppercase">{product.brand}</span>
             </div>

             <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight wrap-break-word max-w-full">
               {product.name}
             </h1>
             
             <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 backdrop-blur-sm">
                <div className="flex flex-col mb-4">
                   <div className="flex flex-wrap items-end gap-3">
                       <span className="text-4xl font-bold text-white tracking-tight">
                           {formatPrice(product.priceUsd)} 
                       </span>
                   </div>
                </div>

                <div className="flex items-center gap-2 text-green-400 text-sm font-medium pt-4 border-t border-white/5">
                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                   Stock disponible
                </div>
             </div>

             {specs.length > 0 && (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {specs.map(([key, value]) => (
                     <div key={key} className="bg-[#13131a] p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                         <span className="text-gray-500 text-[10px] uppercase font-mono block mb-1 tracking-wider">{key}</span>
                         <span className="text-gray-200 text-sm font-medium truncate block" title={value}>{value}</span>
                     </div>
                  ))}
               </div>
             )}

             <div className="mt-auto space-y-4">
                <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] cursor-pointer active:scale-[0.98]">
                   <ShoppingCart size={20} /> AGREGAR AL CARRITO
                </button>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                   <div className="flex items-center gap-2 justify-center py-2 bg-white/2 rounded-lg border border-white/5">
                     <Truck size={16} className="text-cyan-500"/> Envío a todo el país
                   </div>
                   <div className="flex items-center gap-2 justify-center py-2 bg-white/2 rounded-lg border border-white/5">
                     <Shield size={16} className="text-cyan-500"/> Garantía Oficial
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}