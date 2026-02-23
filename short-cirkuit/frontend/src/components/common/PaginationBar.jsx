import React from 'react';

export default function PaginationBar({
  page,
  canPrev,
  canNext,
  onPrev,
  onNext,
  totalPages,
  pageInput,
  onPageInputChange,
  onGo,
  maxInputPage,
  className = '',
  showTotal = true
}) {
  return (
    <div className={`flex flex-wrap justify-center items-center gap-3 ${className}`.trim()}>
      <button
        disabled={!canPrev}
        onClick={onPrev}
        className="p-2 px-4 bg-black/30 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors cursor-pointer text-white font-mono text-xs uppercase"
      >
        Anterior
      </button>

      <span className="font-mono text-xs text-gray-400">
        Pagina <span className="text-white">{page}</span>
        {showTotal && <> de {totalPages || 1}</>}
      </span>

      <button
        disabled={!canNext}
        onClick={onNext}
        className="p-2 px-4 bg-black/30 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors cursor-pointer text-white font-mono text-xs uppercase"
      >
        Siguiente
      </button>

      {typeof onGo === 'function' && typeof onPageInputChange === 'function' && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={maxInputPage}
            value={pageInput}
            onChange={(e) => onPageInputChange(e.target.value)}
            className="w-20 h-9 px-2 rounded-lg bg-black/40 border border-white/20 text-sm text-white"
          />
          <button
            onClick={onGo}
            className="h-9 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase"
          >
            Ir
          </button>
        </div>
      )}
    </div>
  );
}
