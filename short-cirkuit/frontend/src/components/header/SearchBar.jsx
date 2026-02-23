import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, CornerDownRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { fetchProducts } from '../../api/config';
import { useAuth } from '../../context/useAuth';
import { getVisiblePriceArs, isAdminRole } from '../../utils/productPricing';
import CircuitLoader from '../others/CircuitLoader';

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef(null);
  const isAdmin = isAdminRole(user);

  const formatArs = (price) => new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(price);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) { 
        setLoading(true);
        try {
          const res = await fetchProducts({ search: query });
          setResults(res.data || []);
          setIsOpen(true);
        } catch {
          setResults([]);
          setIsOpen(true);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewAll = () => {
    setIsOpen(false);
    navigate(`/catalogo?search=${query}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-50">
      <div className="group relative flex items-center bg-[#0a0a0f] border border-white/10 hover:border-cyan-500/50 focus-within:border-cyan-500 rounded px-4 py-2.5 transition-all duration-300">
        <Search className="w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors mr-3" />
        
        <input 
          type="text" 
          placeholder="MINI PC ASUS" 
          className="w-full bg-transparent outline-none text-white placeholder-gray-600 font-tech tracking-wide text-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleViewAll()}
          onFocus={() => query.length > 1 && setIsOpen(true)}
        />

      </div>

      <AnimatePresence>
        {isOpen && query.trim().length > 1 && (
          <Motion.div 
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#050507]/95 backdrop-blur-xl border border-cyan-500/20 rounded shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="flex justify-between px-3 py-1 bg-cyan-900/10 border-b border-cyan-500/10 text-[10px] text-cyan-500 font-mono uppercase tracking-wider">
                <span>Resultados: {results.length}</span>
                <span>Búsqueda</span>
            </div>

            {loading ? (
              <div className="p-8 flex justify-center">
                <CircuitLoader size="sm" label="Buscando productos" />
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {results.slice(0, 5).map((product, i) => (
                  <Link 
                    key={product.id || i}
                    to={`/producto/${product.id || product._id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-3 border-b border-white/5 hover:bg-cyan-500/5 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#0a0a0f] border border-white/10 rounded overflow-hidden shrink-0 group-hover:border-cyan-500/30 transition-colors">
                       <img src={product.image || product.imageUrl} alt="-" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline">
                          <span className="text-gray-400 text-[10px] font-mono uppercase">{product.category}</span>
                       </div>
                       <h4 className="text-white font-tech font-bold text-lg truncate group-hover:text-cyan-400 transition-colors">{product.name}</h4>
                    </div>

                    <div className="text-right">
                       <span className="block text-cyan-300 font-bold font-mono">{formatArs(getVisiblePriceArs(product, isAdmin))}</span>
                    </div>
                    
                    <CornerDownRight size={14} className="text-gray-700 group-hover:text-cyan-500 transition-colors" />
                  </Link>
                ))}

                {results.length > 5 && (
                  <button onClick={handleViewAll} className="cursor-pointer w-full p-3 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black font-bold font-tech uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                     Ver todos los resultados <ChevronRight size={16}/>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                 <div className="text-gray-500 font-mono text-sm">Sin resultados para <span className="text-white">"{query}"</span></div>
              </div>
            )}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
