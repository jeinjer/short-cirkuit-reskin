import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Check, Shield, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductDetail() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { formatPrice, dolarRate } = useCurrency();

  useEffect(() => {
    fetch(`${API_URL}/products/${sku}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => console.error("Error:", err));
  }, [sku]);

  if (loading) return <div className="min-h-screen bg-[#050507] flex items-center justify-center text-cyan-500">Cargando...</div>;
  if (!product) return <div className="min-h-screen bg-[#050507] flex items-center justify-center text-white">Producto no encontrado</div>;

  const specs = Object.entries(product.specs || {}).filter(([_, v]) => v !== null);

  return (
    <div className="min-h-screen bg-[#050507] pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        <Link to="/" 
              className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition-colors cursor-pointer w-fit">
          <ArrowLeft size={20} /> Volver
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="bg-[#13131a] rounded-3xl p-8 border border-white/5 flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent opacity-50"></div>
             <img src={product.imageUrl} alt={product.name} className="w-full max-w-md object-contain relative z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"/>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
             <span className="text-cyan-400 font-mono text-sm tracking-wider mb-2">{product.brand} / {product.category}</span>
             <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{product.name}</h1>
             
             <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 backdrop-blur-sm">
                <div className="flex flex-col mb-4">
                   <div className="flex items-end gap-3">
                       <span className="text-4xl font-bold text-white">
                           {formatPrice(product.priceUsd)}
                       </span>
                       <span className="text-xl text-gray-400 font-mono mb-1">
                           (US$ {product.priceUsd})
                       </span>
                   </div>
                   <span className="text-gray-500 text-xs mt-1">
                       + IVA incluido • Cotización tomada: ${dolarRate}
                   </span>
                </div>

                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                   Stock disponible: {product.stock} unidades
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-8">
                {specs.map(([key, value]) => (
                   <div key={key} className="bg-[#13131a] p-4 rounded-xl border border-white/5">
                       <span className="text-gray-500 text-xs uppercase font-mono block mb-1">{key}</span>
                       <span className="text-white font-medium truncate block" title={value}>{value}</span>
                   </div>
                ))}
             </div>

             <div className="mt-auto space-y-4">
                <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] cursor-pointer">
                   <ShoppingCart size={20} /> AGREGAR AL CARRITO
                </button>
                
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                   <div className="flex items-center gap-2 justify-center"><Truck size={16}/> Envío Gratis</div>
                   <div className="flex items-center gap-2 justify-center"><Shield size={16}/> Garantía 12 meses</div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}