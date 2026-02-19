import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CatalogPagination({ meta, page, onPageChange }) {
  const [pageInput, setPageInput] = useState(page.toString());

  React.useEffect(() => {
    setPageInput(page.toString());
  }, [page]);

  if (meta.last_page <= 1) return null;

  return (
    <div className="mt-10 sm:mt-12 flex flex-wrap justify-center items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border border-white/5 bg-[#0a0a0f]/30 backdrop-blur-sm w-full sm:w-fit mx-auto">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2.5 sm:p-3 rounded-lg bg-black/20 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
      >
        <ChevronLeft size={22} />
      </button>

      <div className="flex items-center gap-2 sm:gap-3 font-mono">
        <span className="text-gray-400 text-xs sm:text-sm">PAGINA</span>
        <input
          type="text"
          value={pageInput}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) setPageInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              let p = parseInt(pageInput || '1', 10);
              if (p > meta.last_page) p = meta.last_page;
              if (p < 1) p = 1;
              onPageChange(p);
            }
          }}
          onBlur={() => setPageInput(page.toString())}
          className="w-14 h-10 bg-black/40 border border-white/10 rounded-lg text-center text-white focus:border-cyan-500 outline-none text-base transition-colors"
        />
        <span className="text-gray-400 text-xs sm:text-sm">DE {meta.last_page}</span>
      </div>

      <button
        onClick={() => onPageChange(Math.min(meta.last_page, page + 1))}
        disabled={page === meta.last_page}
        className="p-2.5 sm:p-3 rounded-lg bg-black/20 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
