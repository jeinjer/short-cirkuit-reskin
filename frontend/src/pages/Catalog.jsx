import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronLeft, ChevronRight, Check, ArrowRight, ArrowDownUp } from 'lucide-react';
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

  const [filtersData, setFiltersData] = useState({ 
      brands: [], minPrice: 0, maxPrice: 0, specs: { ram: [], cpu: [], panel: [], hz: [] } 
  });

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'price_asc';

  useEffect(() => {
    const loadFilters = async () => {
        const data = await fetchDynamicFilters({ category, search });
        setFiltersData(data);
    };
    loadFilters();
  }, [category, search]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries([...searchParams]);
        const res = await fetchProducts(params);
        setProducts(res.data || []);
        setMeta(res.meta || { page: 1, last_page: 1, total: 0 });
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    newParams.set('page', '1'); 
    setSearchParams(newParams);
  };

  const applyPriceFilter = () => {
      const newParams = new URLSearchParams(searchParams);

      if (!dolarRate) return;

      if (localMinPrice) {
          const minUsd = parseFloat(localMinPrice) / dolarRate;
          newParams.set('minPrice', minUsd.toString());
      } else {
          newParams.delete('minPrice');
      }

      if (localMaxPrice) {
          const maxUsd = parseFloat(localMaxPrice) / dolarRate;
          newParams.set('maxPrice', maxUsd.toString());
      } else {
          newParams.delete('maxPrice');
      }

      newParams.set('page', '1');
      setSearchParams(newParams);
  };

  const isActive = (key, value) => searchParams.get(key) === value;

  return (
    <div className="min-h-screen bg-[#050507] pt-24 pb-12 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8">
        
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="flex items-center gap-2 text-white font-bold mb-4 pb-4 border-b border-white/10">
                <Filter size={20} className="text-cyan-500"/> FILTROS
                {[...searchParams].length > 0 && (
                    <button 
                        onClick={() => {
                            setSearchParams({});
                            setLocalMinPrice("");
                            setLocalMaxPrice("");
                        }}
                        className="text-xs text-red-400 hover:text-red-300 ml-auto flex items-center gap-1 transition-colors"
                    >
                        <X size={12}/> Borrar
                    </button>
                )}
            </div>

            <div className="bg-[#13131a] p-5 rounded-xl border border-white/5">
                <h3 className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-3 flex justify-between">
                    Precio
                </h3>
                <div className="flex items-center gap-2 mb-3">
                    <div className="relative w-full">
                        <span className="absolute left-2 top-1.5 text-gray-500 text-xs">$</span>
                        <input 
                            type="number" 
                            placeholder="Min" 
                            value={localMinPrice}
                            onChange={(e) => setLocalMinPrice(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded pl-5 pr-2 py-1.5 text-xs text-white focus:border-cyan-500 outline-none placeholder-gray-700"
                        />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="relative w-full">
                        <span className="absolute left-2 top-1.5 text-gray-500 text-xs">$</span>
                        <input 
                            type="number" 
                            placeholder="Max" 
                            value={localMaxPrice}
                            onChange={(e) => setLocalMaxPrice(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded pl-5 pr-2 py-1.5 text-xs text-white focus:border-cyan-500 outline-none placeholder-gray-700"
                        />
                    </div>
                </div>
                <button 
                    onClick={applyPriceFilter}
                    disabled={!dolarRate}
                    className="w-full py-1.5 bg-white/5 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded border border-white/5 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    APLICAR <ArrowRight size={12}/>
                </button>
            </div>

            <FilterSection title="Categoría">
                {['COMPUTADORAS', 'NOTEBOOKS', 'MONITORES', 'PLACAS_VIDEO', 'PERIFERICOS_MOUSE'].map(cat => (
                    <FilterItem 
                        key={cat} label={cat.replace('_', ' ')} 
                        active={isActive('category', cat)}
                        onClick={() => {
                            const newParams = new URLSearchParams();
                            newParams.set('category', cat);
                            if(sort) newParams.set('sort', sort);
                            setSearchParams(newParams);
                        }}
                    />
                ))}
            </FilterSection>

            {filtersData.brands.length > 0 && (
                <FilterSection title="Marcas">
                    {filtersData.brands.map(b => (
                        <FilterItem key={b.name} label={b.name} count={b.count} 
                            active={isActive('brand', b.name)}
                            onClick={() => {
                                const newParams = new URLSearchParams(searchParams);
                                if (isActive('brand', b.name)) newParams.delete('brand');
                                else newParams.set('brand', b.name);
                                setSearchParams(newParams);
                            }}
                        />
                    ))}
                </FilterSection>
            )}

            {filtersData.specs?.cpu?.length > 0 && (
                <FilterSection title="Familia CPU">
                    {filtersData.specs.cpu.map(val => (
                        <FilterItem key={val} label={val} active={isActive('cpu', val)} 
                            onClick={() => {
                                const newParams = new URLSearchParams(searchParams);
                                if (isActive('cpu', val)) newParams.delete('cpu');
                                else newParams.set('cpu', val);
                                setSearchParams(newParams);
                            }}
                        />
                    ))}
                </FilterSection>
            )}
            
             {filtersData.specs?.ram?.length > 0 && (
                <FilterSection title="Memoria RAM">
                    {filtersData.specs.ram.map(val => (
                        <FilterItem key={val} label={val} active={isActive('ram', val)} 
                        onClick={() => {
                            const newParams = new URLSearchParams(searchParams);
                            if (isActive('ram', val)) newParams.delete('ram');
                            else newParams.set('ram', val);
                            setSearchParams(newParams);
                        }} />
                    ))}
                </FilterSection>
            )}

            {filtersData.specs?.panel?.length > 0 && (
                <FilterSection title="Tipo de Panel">
                    {filtersData.specs.panel.map(val => (
                        <FilterItem key={val} label={val} active={isActive('panel', val)} 
                        onClick={() => {
                            const newParams = new URLSearchParams(searchParams);
                            if (isActive('panel', val)) newParams.delete('panel');
                            else newParams.set('panel', val);
                            setSearchParams(newParams);
                        }} />
                    ))}
                </FilterSection>
            )}

             {filtersData.specs?.hz?.length > 0 && (
                <FilterSection title="Tasa de Refresco">
                    {filtersData.specs.hz.map(val => (
                        <FilterItem key={val} label={val} active={isActive('hz', val)} 
                        onClick={() => {
                            const newParams = new URLSearchParams(searchParams);
                            if (isActive('hz', val)) newParams.delete('hz');
                            else newParams.set('hz', val);
                            setSearchParams(newParams);
                        }} />
                    ))}
                </FilterSection>
            )}

        </aside>

        <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">
                        {search ? `"${search}"` : category ? category.replace('_', ' ') : 'Catálogo'}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {meta.total} productos encontrados
                    </p>
                </div>

                {products.length > 0 && (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                            <ArrowDownUp size={14}/> Ordenar:
                        </span>
                        <select 
                            value={sort}
                            onChange={(e) => updateFilter('sort', e.target.value)}
                            className="bg-[#13131a] border border-white/10 text-white text-sm rounded px-3 py-1.5 focus:border-cyan-500 outline-none cursor-pointer"
                        >
                            <option value="price_asc">Precio: Menor a Mayor</option>
                            <option value="price_desc">Precio: Mayor a Menor</option>
                            <option value="name_asc">Nombre: A - Z</option>
                            <option value="name_desc">Nombre: Z - A</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
                {loading ? (
                    [...Array(8)].map((_, i) => <SkeletonProduct key={i} />)
                ) : (
                    products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-20 bg-[#13131a] rounded-xl border border-white/5 border-dashed">
                            <p className="mb-4">No hay productos con estos filtros.</p>
                            <button onClick={() => {
                                setSearchParams({});
                                setLocalMinPrice("");
                                setLocalMaxPrice("");
                            }} className="text-cyan-400 hover:underline mt-2">
                                Limpiar filtros
                            </button>
                        </div>
                    )
                )}
            </div>

            {meta.last_page > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                    <button 
                        onClick={() => {
                            const p = Math.max(1, page - 1);
                            const newParams = new URLSearchParams(searchParams);
                            newParams.set('page', p.toString());
                            setSearchParams(newParams);
                        }}
                        disabled={page === 1}
                        className="p-2 rounded-lg bg-[#13131a] border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyan-500 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-gray-400 font-mono text-sm">
                        Página <span className="text-white font-bold">{page}</span> de {meta.last_page}
                    </span>
                    <button 
                        onClick={() => {
                            const p = Math.min(meta.last_page, page + 1);
                            const newParams = new URLSearchParams(searchParams);
                            newParams.set('page', p.toString());
                            setSearchParams(newParams);
                        }}
                        disabled={page === meta.last_page}
                        className="p-2 rounded-lg bg-[#13131a] border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyan-500 transition-colors"
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

function FilterSection({ title, children }) {
    return (
        <div className="bg-[#13131a] rounded-xl border border-white/5 overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 bg-white/2">
                <h3 className="text-gray-300 text-xs font-bold uppercase tracking-wider">{title}</h3>
            </div>
            <div className="p-4 flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </div>
    );
}

function FilterItem({ label, count, active, onClick }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group py-1.5 hover:bg-white/5 px-2 rounded-lg transition-colors">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${active ? 'bg-cyan-600 border-cyan-600' : 'border-gray-600 group-hover:border-gray-400'}`}>
                {active && <Check size={10} className="text-white" />}
            </div>
            <input type="checkbox" className="hidden" checked={active} onChange={onClick} />
            <span className={`text-sm flex-1 truncate transition-colors ${active ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                {label}
            </span>
            {count !== undefined && <span className="text-xs text-gray-600 font-mono">{count}</span>}
        </label>
    );
}