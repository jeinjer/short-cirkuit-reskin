import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom'; 
import { useCurrency } from '../../context/CurrencyContext';

export default function ProductCard({ product }) {
  const { formatPrice } = useCurrency(); 
  const specsToShow = Object.values(product.specs || {}).filter(Boolean).slice(0, 3);

  return (
    <Link 
      to={`/producto/${product.sku}`} 
      className="group bg-[#13131a] rounded-2xl border border-white/5 hover:border-cyan-500/50 overflow-hidden flex flex-col h-full shadow-lg transition-all duration-200 hover:-translate-y-1 relative"
    >
      <div className="relative h-56 overflow-hidden bg-[#0a0a0f]">
        <div className="absolute inset-0 bg-linear-to-t from-[#13131a] via-transparent to-transparent z-10 opacity-60"></div>
        <img 
          src={product.imageUrl || product.img} 
          alt={product.name} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500 will-change-transform"
          loading="lazy"
        />
        
        <div className="absolute top-3 right-3 z-20 bg-black/80 border border-white/10 px-2 py-1 rounded text-[10px] text-cyan-300 font-mono uppercase">
          {product.category?.replace('_', ' ')}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col relative z-20">
        <div className="mb-1 flex justify-between items-start">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">{product.brand}</span>
          <div className="flex gap-0.5 text-yellow-500">
             {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
          </div>
        </div>
        
        <h3 className="text-md font-bold text-white mb-3 leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[26px]">
          {specsToShow.map((spec, i) => (
            <span key={i} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5 font-mono whitespace-nowrap">
              {spec}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="block text-[10px] text-gray-500 font-mono uppercase">Contado</span>
            
            <span className="text-xl font-bold text-white tracking-tight block">
              {formatPrice(product.priceUsd)}
            </span>
            
            <span className="text-[10px] text-cyan-500/80 font-mono">
               US$ {product.priceUsd}
            </span>
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault(); 
              console.log("Agregado al carrito:", product.sku);
            }}
            className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center hover:bg-cyan-500 transition-colors cursor-pointer active:scale-95 shadow-lg shadow-cyan-900/20 z-30 relative"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}