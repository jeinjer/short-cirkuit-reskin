import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronLeft, ChevronRight, ArrowDownUp, Grip, Monitor, Printer, Cpu, Database } from 'lucide-react';
import { fetchProducts, fetchDynamicFilters } from '../api/config';
import ProductCard from '../components/ui/ProductCard';
import SkeletonProduct from '../components/ui/SkeletonProduct';
import { useCurrency } from '../context/CurrencyContext';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, last_page: 1, total: 0 });
  const [searchParams, setSearchParams] = useSearchParams();
  const { dolarRate } = useCurrency(); 
  
  const [localMinPrice, setLocalMinPrice] = useState("");
  const [localMaxPrice, setLocalMaxPrice] = useState("");
  const [pageInput, setPageInput] = useState("1");
  
  // Ya no guardamos minPrice/maxPrice dinámicos
  const [filtersData, setFiltersData] = useState({ 
      brands: [], specs: { cpu: [], ram: [] }
  });

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const selectedBrand = searchParams.get('brand');
  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'price_asc';

  useEffect(() => {
    const loadFilters = async () => {
        const params = { category, search, brand: selectedBrand };
        const data = await fetchDynamicFilters(params);
        
        if (data) {
            setFiltersData(prev => ({
                ...prev,
                brands: data.brands || [],
                specs: data.specs || { cpu: [], ram: [] }
            }));
        }
    };
    loadFilters();
  }, [category, search, selectedBrand]);

  // Carga Productos
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries([...searchParams]);
        const res = await fetchProducts(params);
        setProducts(res.data || []);
        setMeta(res.meta || { page: 1, last_page: 1, total: 0 });
        setPageInput(res.meta?.page?.toString() || "1");
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchParams]);

  // Handlers
  const handleFilterChange = (key, value) => {
      const newParams = new URLSearchParams(searchParams);
      if (value === searchParams.get(key)) newParams.delete(key);
      else newParams.set(key, value);
      
      if (key === 'category') {
          ['brand', 'minPrice', 'maxPrice'].forEach(k => newParams.delete(k));
      }
      if (key === 'brand') {
          ['cpu', 'ram'].forEach(k => newParams.delete(k));
      }

      newParams.set('page', '1');
      setSearchParams(newParams);
  };

  const applyPriceFilter = () => {
      if (!dolarRate) return;
      const newParams = new URLSearchParams(searchParams);
      if (localMinPrice) newParams.set('minPrice', (parseFloat(localMinPrice) / dolarRate).toString());
      else newParams.delete('minPrice');
      if (localMaxPrice) newParams.set('maxPrice', (parseFloat(localMaxPrice) / dolarRate).toString());
      else newParams.delete('maxPrice');
      newParams.set('page', '1');
      setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
  };

  const CATEGORIES = [
      { id: 'NOTEBOOKS', label: 'Notebooks', icon: <Monitor size={14}/> },
      { id: 'COMPUTADORAS', label: 'Computadoras', icon: <Grip size={14}/> },
      { id: 'MONITORES', label: 'Monitores', icon: <Monitor size={14}/> },
      { id: 'IMPRESORAS', label: 'Impresoras', icon: <Printer size={14}/> },
  ];

  const renderFilterList = (items, activeVal, keyName) => {
      if (!items || !Array.isArray(items) || items.length === 0) return null;
      return items.map((item, idx) => {
          const label = item.name || item; 
          const count = item.count;
          const uniqueKey = `${keyName}-${label}-${idx}`;

          return (
             <label key={uniqueKey} className={`flex items-center gap-2 cursor-pointer p-1.5 rounded transition-all ${activeVal === label ? 'bg-cyan-900/20 border border-cyan-500/30' : 'hover:bg-white/5 border border-transparent'}`}>
                <div className={`w-3 h-3 flex items-center justify-center rounded-full border ${activeVal === label ? 'border-cyan-500 bg-cyan-500' : 'border-gray-600'}`}>
                    {activeVal === label && <div className="w-1 h-1 bg-white rounded-full"/>}
                </div>
                <input 
                    type="radio" 
                    className="hidden" 
                    checked={activeVal === label} 
                    onChange={() => handleFilterChange(keyName, label)} 
                />
                <span className={`text-xs flex-1 truncate ${activeVal === label ? 'text-cyan-100 font-medium' : 'text-gray-400'}`}>
                    {label}
                </span>
                {count !== undefined && <span className="text-[10px] text-gray-600 font-mono">{count}</span>}
            </label>
          );
      });
  };

  return (
    <div className="min-h-screen bg-[#050507] pt-24 pb-12 px-4 font-sans">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="flex items-center gap-2 text-white font-bold mb-4 pb-4 border-b border-white/10">
                <Filter size={20} className="text-cyan-500"/> FILTROS
                {[...searchParams].length > 0 && (
                    <button onClick={() => { setSearchParams({}); setLocalMinPrice(""); setLocalMaxPrice(""); }} 
                            className="text-xs text-red-400 hover:text-red-300 ml-auto flex items-center gap-1">
                        <X size={12}/> Borrar
                    </button>
                )}
            </div>

            {/* 1. Categorías */}
            <div className="bg-[#13131a] rounded-xl border border-white/5 overflow-hidden">
                <div className="px-4 py-2 border-b border-white/5 bg-white/2">
                    <h3 className="text-gray-300 text-[10px] font-bold uppercase tracking-wider">Tipo de Producto</h3>
                </div>
                <div className="p-2 flex flex-col gap-1">
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => handleFilterChange('category', cat.id)}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors w-full text-left
                                ${category === cat.id ? 'bg-cyan-900/20 text-cyan-100 border border-cyan-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${category === cat.id ? 'bg-cyan-400' : 'bg-gray-600'}`} />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Marcas */}
            {filtersData.brands?.length > 0 && (
                <div className="bg-[#13131a] rounded-xl border border-white/5 overflow-hidden animate-in fade-in slide-in-from-left-4">
                    <div className="px-4 py-2 border-b border-white/5 bg-white/2 flex justify-between items-center">
                        <h3 className="text-gray-300 text-[10px] font-bold uppercase tracking-wider">Marca</h3>
                        <Monitor size={14} className="text-cyan-500"/>
                    </div>
                    <div className="p-2 flex flex-col gap-0.5 max-h-56 overflow-y-auto custom-scrollbar">
                        {renderFilterList(filtersData.brands, selectedBrand, 'brand')}
                    </div>
                </div>
            )}

            <div className="bg-[#13131a] p-4 rounded-xl border border-white/5">
                <h3 className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-3">Precio (ARS)</h3>
                
                <div className="flex items-center gap-2 mb-2">
                    <input 
                        type="number" placeholder="Min" value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white text-center"
                    />
                    <span className="text-gray-500">-</span>
                    <input 
                        type="number" placeholder="Max" value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white text-center"
                    />
                </div>
                <button onClick={applyPriceFilter} className="w-full py-1.5 bg-white/5 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded border border-white/5 hover:border-cyan-500/50 transition-all">
                    Filtrar
                </button>
            </div>
        </aside>

        <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
                 <div>
                    <h1 className="text-xl font-bold text-white uppercase">{category ? category.replace('_', ' ') : 'Catálogo Completo'}</h1>
                    <p className="text-xs text-gray-500 mt-1">{meta.total} resultados {selectedBrand && `> ${selectedBrand}`}</p>
                 </div>
                 
                 <div className="flex items-center gap-2">
                     <span className="text-xs text-gray-500"><ArrowDownUp size={14}/></span>
                     <select 
                        value={sort}
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                        className="bg-[#13131a] text-white text-xs border border-white/10 rounded px-3 py-1.5 outline-none hover:border-cyan-500/50 cursor-pointer"
                    >
                        <option value="price_asc">Menor Precio</option>
                        <option value="price_desc">Mayor Precio</option>
                        <option value="name_asc">Nombre A - Z</option>
                        <option value="name_desc">Nombre Z - A</option>
                     </select>
                 </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {[...Array(4)].map((_, i) => <SkeletonProduct key={i} />)}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
                    {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            ) : (
                <div className="py-20 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                    No se encontraron productos.
                </div>
            )}
             
            {meta.last_page > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                    <button 
                        onClick={() => handlePageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg bg-[#13131a] border border-white/10 text-white disabled:opacity-50 hover:border-cyan-500 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Pág</span>
                        <input 
                            type="text" 
                            value={pageInput}
                            onChange={(e) => {
                                if (/^\d*$/.test(e.target.value)) setPageInput(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    let p = parseInt(pageInput);
                                    if(p > meta.last_page) p = meta.last_page;
                                    if(p < 1) p = 1;
                                    handlePageChange(p);
                                }
                            }}
                            onBlur={() => setPageInput(page.toString())}
                            className="w-10 h-8 bg-black/30 border border-white/10 rounded text-center text-white focus:border-cyan-500 outline-none text-sm"
                        />
                        <span className="text-gray-400 text-sm">de {meta.last_page}</span>
                    </div>

                    <button 
                        onClick={() => handlePageChange(Math.min(meta.last_page, page + 1))}
                        disabled={page === meta.last_page}
                        className="p-2 rounded-lg bg-[#13131a] border border-white/10 text-white disabled:opacity-50 hover:border-cyan-500 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}