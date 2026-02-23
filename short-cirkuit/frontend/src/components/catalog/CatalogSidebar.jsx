import React, { useEffect, useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { categories } from '../../data/categories/categories.data';
import CircuitLoader from '../others/CircuitLoader';

export default function CatalogSidebar({
  searchParams,
  setSearchParams,
  filtersData,
  filtersLoading,
  onApplyPrice
}) {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const category = searchParams.get('category');
  const selectedBrand = searchParams.get('brand');

  const hasBrands = filtersData.brands && filtersData.brands.length > 0;

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(true);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (key === 'category' && value === 'all') {
      newParams.delete('category');
    } else if (value === searchParams.get(key)) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    if (key === 'category') ['brand', 'minPrice', 'maxPrice'].forEach((k) => newParams.delete(k));
    if (key === 'brand') ['cpu', 'ram'].forEach((k) => newParams.delete(k));

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAll = () => {
    setSearchParams({});
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-white font-bold mb-1 lg:mb-4 pb-3 lg:pb-4 border-b border-white/10 font-cyber tracking-wide">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="lg:hidden inline-flex items-center gap-2 text-white rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-3 py-2"
        >
          <Filter size={20} className="text-cyan-500" />
          <span className="text-sm uppercase tracking-wider">Filtros</span>
          {isOpen ? <ChevronUp size={16} className="text-cyan-400" /> : <ChevronDown size={16} className="text-cyan-400" />}
        </button>

        <div className="hidden lg:inline-flex items-center gap-2">
          <Filter size={24} className="text-cyan-500" />
          <span className="text-lg">FILTROS</span>
        </div>

        {[...searchParams].length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-red-400 hover:text-red-300 ml-auto flex items-center gap-1 uppercase tracking-wider border border-red-500/20 px-3 py-1.5 rounded hover:bg-red-500/10 transition-colors"
          >
            <X size={14} /> Borrar Todo
          </button>
        )}
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} lg:block space-y-6`}>
        <div className="bg-[#0a0a0f]/80 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden shadow-lg">
          <div className="px-4 py-3 border-b border-white/5 bg-white/2">
            <h3 className="text-cyan-500 text-sm font-bold uppercase tracking-widest font-mono">Tipo de Producto</h3>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {categories
              .filter((c) => c.id !== 'all')
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange('category', cat.id)}
                  className={`cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all w-full text-left font-mono
                          ${category === cat.id ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  <span className={category === cat.id ? 'text-cyan-400' : 'text-gray-600'}>
                    <cat.icon size={16} />
                  </span>
                  {cat.label}
                </button>
              ))}
          </div>
        </div>

        {(filtersLoading || hasBrands) && (
          <div className="bg-[#0a0a0f]/80 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden shadow-lg">
            <div className="px-4 py-3 border-b border-white/5 bg-white/2">
              <h3 className="text-cyan-500 text-sm font-bold uppercase tracking-widest font-mono">Marca</h3>
            </div>
            <div className="p-2 flex flex-col gap-0.5 max-h-64 overflow-y-auto custom-scrollbar">
              {filtersLoading && !hasBrands ? (
                <div className="py-6 flex justify-center">
                  <CircuitLoader size="sm" label="Cargando marcas" />
                </div>
              ) : (
                <div className={`transition-opacity duration-200 ${filtersLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                  {filtersData.brands.map((item, idx) => {
                    const label = item.name || item;
                    const isActive = selectedBrand === label;
                    return (
                      <label
                        key={idx}
                        className={`group flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all border ${isActive ? 'bg-cyan-900/20 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'hover:bg-white/5 border-transparent'}`}
                      >
                        <div
                          className={`w-4 h-4 flex items-center justify-center rounded-sm border transition-colors ${isActive ? 'border-cyan-400 bg-cyan-400' : 'border-gray-600 group-hover:border-gray-400'}`}
                        >
                          {isActive && <div className="w-2 h-2 bg-black" />}
                        </div>
                        <input type="radio" className="hidden" checked={isActive} onChange={() => handleFilterChange('brand', label)} />
                        <span className={`text-sm flex-1 truncate font-mono ${isActive ? 'text-cyan-300' : 'text-gray-400 group-hover:text-gray-300'}`}>
                          {label}
                        </span>
                        {item.count !== undefined && <span className="text-xs text-gray-600 font-mono bg-white/5 px-2 py-0.5 rounded">{item.count}</span>}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-[#0a0a0f]/80 backdrop-blur-sm p-5 rounded-xl border border-white/10 shadow-lg">
          <h3 className="text-cyan-500 text-sm font-bold uppercase tracking-widest font-mono mb-4">Rango de precio</h3>
          <div className="flex items-center gap-3 mb-4">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-black/40 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2.5 text-sm text-white text-center outline-none transition-colors font-mono"
            />
            <span className="text-gray-500 font-bold">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-black/40 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2.5 text-sm text-white text-center outline-none transition-colors font-mono"
            />
          </div>
          <button
            onClick={() => onApplyPrice(minPrice, maxPrice)}
            className="w-full py-2.5 bg-cyan-900/20 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 text-sm font-bold rounded-lg border border-cyan-500/30 hover:border-cyan-500/60 transition-all uppercase tracking-wider"
          >
            Aplicar Filtro
          </button>
        </div>
      </div>
    </aside>
  );
}
