import React from 'react';
import { Search } from 'lucide-react';

export default function AdminToolbar({ search, setSearch, setPage }) {
  return (
    <div className="bg-[#13131a] p-4 rounded-t-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
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
    </div>
  );
}