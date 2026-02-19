import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getVisiblePriceArs, isAdminRole } from '../../../utils/productPricing';

const CatalogProductCard = ({ product, viewMode = 'grid' }) => {
  const { user } = useAuth();
  const isAdmin = isAdminRole(user);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  const isGrid = viewMode === 'grid';
  const visiblePrice = getVisiblePriceArs(product, isAdmin);

  return (
    <Link 
      to={`/producto/${product.id || product._id}`}
      className={`
        group relative block bg-[#08080a] border border-white/10 hover:border-cyan-500/50 
        transition-all duration-300 rounded-xl overflow-hidden hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]
        ${isGrid ? 'h-full flex flex-col' : 'h-32 md:h-40 flex flex-row'}
      `}
    >
      
      <div className={`relative overflow-hidden bg-[#050507] shrink-0
          ${isGrid ? 'w-full pt-[80%]' : 'w-32 md:w-48 h-full'}
      `}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400x400?text=NO+IMAGE'} 
          alt={product.name}
          className={`
            absolute inset-0 w-full h-full object-contain 
            grayscale-[0.8] brightness-75 contrast-125
            group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 
            transition-all duration-500 ease-out z-10
            ${isGrid ? 'p-6 group-hover:scale-110' : 'p-2 md:p-4 group-hover:scale-105'}
          `}
        />

        <div className={`absolute top-2 right-2 z-20 ${!isGrid && 'hidden md:block'}`}>
             {product.quantity > 0 ? (
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-black/60 backdrop-blur rounded border border-emerald-500/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
            ) : (
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-black/60 backdrop-blur rounded border border-red-500/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                </div>
            )}
        </div>
      </div>

      <div className={`flex flex-col relative z-20 border-white/5 bg-[#08080a] grow
        ${isGrid ? 'p-4 border-t' : 'p-4 border-l justify-center'}
      `}>

        <div className="mb-2">
            <p className="text-xs font-mono font-bold text-cyan-600 mb-1 uppercase tracking-widest">
                {product.category || 'HARDWARE'}
            </p>
            
            <h3 className={`font-cyber font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight
                ${isGrid ? 'text-base md:text-lg line-clamp-2' : 'text-xl md:text-2xl line-clamp-1'}
            `}>
                {product.name}
            </h3>
        </div>

        <div className={`mt-auto ${isGrid ? 'pt-3 border-t border-white/5' : ''}`}>
            <span className="text-xs text-gray-500 font-mono block mb-0.5">PRECIO FINAL</span>
            <span className={`font-black text-white tracking-tight ${isGrid ? 'text-2xl' : 'text-3xl'}`}>
              {formatPrice(visiblePrice)}
            </span>
        </div>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500/30 rounded-xl pointer-events-none transition-colors duration-500" />
    </Link>
  );
};

export default CatalogProductCard;
