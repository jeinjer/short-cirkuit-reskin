import React from 'react';
import { X } from 'lucide-react';

export default function ViewProductModal({ product, onClose, priceCurrency = 'ARS', dolarValue = 0 }) {
  const showArs = priceCurrency === 'ARS';

  const formatPrice = (priceUsd, priceArs) => {
    if (showArs) {
      const computedArs = Number.isFinite(priceArs)
        ? priceArs
        : (Number(priceUsd) || 0) * (Number(dolarValue) || 0);

      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
      }).format(computedArs || 0);
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Number(priceUsd) || 0);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-[#13131a] border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"><X /></button>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 bg-white rounded-xl p-4 flex items-center justify-center min-h-[200px]">
            <img src={product.imageUrl} className="max-h-64 object-contain" alt="" />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <span className="text-cyan-400 font-mono text-xs border border-cyan-500/30 px-2 py-1 rounded bg-cyan-900/20">{product.sku}</span>
            <h2 className="text-2xl font-bold text-white leading-tight">{product.name}</h2>
            <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
              <div>
                <p className="text-xs text-gray-500 uppercase">Costo ({showArs ? 'ARS' : 'USD'})</p>
                <p className="text-lg font-mono text-gray-300">{formatPrice(product.costPrice, null)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Venta ({showArs ? 'ARS' : 'USD'})</p>
                <p className="text-lg font-bold text-green-400">{formatPrice(product.priceUsd, product.price)}</p>
              </div>
              <div><p className="text-xs text-gray-500 uppercase">Marca</p><p className="text-white truncate">{product.brand}</p></div>
              <div><p className="text-xs text-gray-500 uppercase">Categoria</p><p className="text-white truncate">{product.category}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
