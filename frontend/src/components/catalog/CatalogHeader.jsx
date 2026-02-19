import React from 'react';
import { ArrowDownUp, LayoutGrid, List } from 'lucide-react';

export default function CatalogHeader({
  category,
  totalResults,
  viewMode,
  setViewMode,
  sort,
  onSortChange
}) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4 bg-[#0a0a0f]/50 p-4 sm:p-6 rounded-xl border backdrop-blur-sm">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase font-cyber tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] break-words">
          {category ? category.replace('_', ' ') : 'Catalogo'}
        </h1>
        <p className="text-sm text-gray-400 mt-2 font-mono flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
          {totalResults} resultados encontrados
        </p>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 w-full md:w-auto">
        <div className="flex bg-black/40 rounded-lg border border-white/10 p-1.5 shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-gray-500 hover:text-white'}`}
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-gray-500 hover:text-white'}`}
          >
            <List size={20} />
          </button>
        </div>

        <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

        <div className="relative group flex-1 sm:flex-none min-w-0">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 group-hover:text-cyan-400 transition-colors">
            <ArrowDownUp size={16} />
          </div>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-black/40 text-white text-sm border border-white/10 rounded-lg pl-10 pr-6 py-2.5 outline-none hover:border-cyan-500/50 cursor-pointer appearance-none font-mono tracking-wide w-full sm:w-48 transition-colors"
          >
            <option value="price_asc">Menor Precio</option>
            <option value="price_desc">Mayor Precio</option>
            <option value="name_asc">Nombre A - Z</option>
            <option value="name_desc">Nombre Z - A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
