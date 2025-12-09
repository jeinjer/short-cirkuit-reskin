import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts } from '../../api/config';
import { useCurrency } from '../../context/CurrencyContext';

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const containerRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) { 
        setLoading(true);
        setIsOpen(true);
        try {
          const res = await fetchProducts({ search: query });
          setResults(res.data || []);
        } catch (error) {
          console.error(error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 600);
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleViewAll();
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, x: -20, filter: 'blur(10px)' }, visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-50">
      
      <div className="relative w-full flex items-center bg-[#13131a] border border-white/10 rounded-lg px-4 py-2 focus-within:border-cyan-500/50 transition-all shadow-lg">
        <Search className="w-4 h-4 text-gray-400 mr-3" />
        <input 
          type="text" 
          placeholder="Buscar hardware..." 
          className="w-full bg-transparent outline-none text-white placeholder-gray-600 font-sans text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 1 && setIsOpen(true)}
        />
        {loading && <Loader className="w-4 h-4 text-cyan-500 animate-spin ml-2"/>}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div 
            initial="hidden" animate="visible" exit="hidden" variants={containerVariants}
            className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {results.slice(0, 5).map((product) => (
              <motion.div key={product.id || product._id} variants={itemVariants}>
                <Link 
                    to={`/producto/${product.sku}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-3 border-b border-white/5 hover:bg-white/5 transition-colors group relative"
                >
                    <div className="w-12 h-12 bg-white/5 rounded-md overflow-hidden shrink-0 border border-white/5 group-hover:border-cyan-500/50 transition-colors">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-center min-w-0">
                    <span className="text-white font-bold text-xs uppercase tracking-wide truncate group-hover:text-cyan-100">
                        {product.name}
                    </span>
                    <span className="text-cyan-400 font-mono text-sm font-bold">
                        {formatPrice(product.priceUsd)}
                    </span>
                    </div>
                    
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </motion.div>
            ))}

            {results.length > 5 && (
              <motion.div variants={itemVariants}>
                  <button 
                    onClick={handleViewAll}
                    className="w-full p-3 bg-cyan-900/20 text-center cursor-pointer hover:bg-cyan-900/40 transition-colors flex items-center justify-center gap-2 group"
                  >
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest group-hover:text-white transition-colors">
                    Ver los {results.length} resultados
                    </span>
                    <ChevronRight size={12} className="text-cyan-400 group-hover:text-white" />
                  </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}