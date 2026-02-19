import React from 'react';
import CatalogProductCard from '../products/cards/CatalogProductCard';
import CircuitLoader from '../others/CircuitLoader';

export default function CatalogGrid({
  loading,
  products,
  viewMode,
  onClearFilters
}) {
  if (loading) {
    return (
      <div className="py-16 sm:py-20 flex justify-center">
        <CircuitLoader label="Cargando productos" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 sm:py-24 px-4 text-center border border-dashed border-white/10 rounded-xl bg-[#0a0a0f]/30 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-base sm:text-lg font-mono">No se encontraron productos con estos filtros.</p>
        <button
          onClick={onClearFilters}
          className="px-5 sm:px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-cyan-400 text-sm font-bold transition-all"
        >
          Limpiar busqueda
        </button>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6' : 'flex flex-col gap-4 sm:gap-6'}>
      {products.map((p) => (
        <CatalogProductCard key={p.id} product={p} viewMode={viewMode} />
      ))}
    </div>
  );
}
