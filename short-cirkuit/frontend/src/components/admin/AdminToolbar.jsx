import React from 'react';
import { Search } from 'lucide-react';

export default function AdminToolbar({
  search,
  setSearch,
  setPage,
  inStockOnly,
  setInStockOnly,
  missingImageOnly,
  setMissingImageOnly
}) {
  return (
    <div className="bg-[#13131a] p-4 rounded-t-2xl border border-white/5 flex flex-col gap-3">
        <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18}/>
            <input 
                type="text" 
                placeholder="Buscar por Nombre, SKU o Marca..." 
                className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-cyan-500 outline-none transition-colors"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <label className={`h-9 px-3 rounded-lg border text-xs font-bold uppercase tracking-wide cursor-pointer inline-flex items-center gap-2 transition-colors ${
            inStockOnly ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200' : 'border-white/15 bg-white/5 text-gray-300 hover:bg-white/10'
          }`}>
            <input
              type="checkbox"
              className="accent-cyan-500"
              checked={inStockOnly}
              onChange={(e) => {
                setInStockOnly(e.target.checked);
                setPage(1);
              }}
            />
            Solo en stock
          </label>

          <label className={`h-9 px-3 rounded-lg border text-xs font-bold uppercase tracking-wide cursor-pointer inline-flex items-center gap-2 transition-colors ${
            missingImageOnly ? 'border-amber-500/40 bg-amber-500/10 text-amber-200' : 'border-white/15 bg-white/5 text-gray-300 hover:bg-white/10'
          }`}>
            <input
              type="checkbox"
              className="accent-amber-500"
              checked={missingImageOnly}
              onChange={(e) => {
                setMissingImageOnly(e.target.checked);
                setPage(1);
              }}
            />
            Sin imágen real
          </label>
        </div>
    </div>
  );
}
