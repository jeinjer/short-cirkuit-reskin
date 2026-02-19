import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getVisiblePriceArs, isAdminRole } from '../../../utils/productPricing';

const HomeProductCard = ({ product }) => {
  const { user } = useAuth();
  const isAdmin = isAdminRole(user);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  const visiblePrice = getVisiblePriceArs(product, isAdmin);

  return (
    <div className="cursor-pointer group relative flex flex-col h-full bg-[#08080a] border border-white/10 hover:border-cyan-500/50 transition-all duration-500 rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      <Link to={`/producto/${product.id || product._id}`} className="relative w-full pt-[80%] bg-[#050507] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400x400?text=NO+IMAGE'} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-6
                     grayscale-[0.8] brightness-75 contrast-125
                     group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 group-hover:scale-110
                     transition-all duration-500 ease-out z-10"
        />

        <div className="absolute top-3 right-3 z-20">
            {product.quantity > 0 ? (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-emerald-500/30">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 font-mono tracking-wider">STOCK</span>
                </div>
            ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-red-500/30">
                    <AlertCircle size={14} className="text-red-400" />
                    <span className="text-xs font-bold text-red-400 font-mono tracking-wider">AGOTADO</span>
                </div>
            )}
        </div>
      </Link>

      <div className="flex flex-col grow p-6 border-t border-white/5 bg-[#08080a] relative z-20">
        
        <p className="text-xs font-mono font-bold text-cyan-600 mb-2 uppercase tracking-widest">
          {product.category || 'HARDWARE'}
        </p>

        <Link to={`/producto/${product.id || product._id}`} className="grow">
          <h3 className="text-white font-cyber font-bold text-lg md:text-xl leading-tight mb-4 group-hover:text-cyan-300 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-center mt-auto pt-4 border-t border-white/5 group-hover:border-cyan-500/20 transition-colors">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {formatPrice(visiblePrice)}
            </span>
          </div>

        </div>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500/30 rounded-xl pointer-events-none transition-colors duration-500" />
    </div>
  );
};

export default HomeProductCard;
