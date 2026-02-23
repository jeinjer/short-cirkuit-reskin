import React from 'react';

import CircuitLoader from '../others/CircuitLoader';
import { formatArs } from '../../utils/formatters';

export default function CheckoutSummaryPanel({
  items,
  summary,
  cartLoading,
  hasItems,
}) {
  return (
    <aside className="bg-[#0d0d12] border border-cyan-500/20 rounded-2xl p-5 md:p-6 h-fit">
      <h2 className="text-xl font-bold mb-4">Resumen</h2>
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {cartLoading ? (
          <div className="py-6 flex justify-center">
            <CircuitLoader size="sm" label="Cargando carrito" />
          </div>
        ) : hasItems ? (
          items.map((item) => (
            <div
              key={item.id}
              className="border border-white/10 rounded-lg p-3 bg-black/20 flex items-center gap-3"
            >
              <div className="w-14 h-14 rounded-lg bg-[#050507] border border-cyan-500/20 p-1 shrink-0 flex items-center justify-center">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="max-h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm line-clamp-2">{item.product.name}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                  <span>Cantidad: {item.quantity}</span>
                  <span>{formatArs(item.subtotalArs)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No hay productos en carrito.</p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Items</span>
          <span>{summary.totalItems}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="font-bold">Total</span>
          <span className="font-black text-cyan-400">{formatArs(summary.totalArs)}</span>
        </div>
      </div>
    </aside>
  );
}
