import React from 'react';
import { ArrowDown, ArrowUp, Eye, Edit, Power } from 'lucide-react';
import CircuitLoader from '../others/CircuitLoader';

export default function ProductTable({ products, loading, onView, onEdit, onToggle, priceCurrency, setPriceCurrency, dolarValue, productSort, onSortChange }) {
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

  if (loading) return <div className="bg-[#13131a] p-12 flex justify-center border-x border-white/5"><CircuitLoader /></div>;

  if (products.length === 0) return <div className="bg-[#13131a] p-8 text-center text-gray-500 border-x border-white/5">No se encontraron productos</div>;

  return (
    <div className="bg-[#13131a] border-x border-b border-white/5">
      <div className="flex items-center justify-between p-3 border-b border-white/5 gap-3">
        <div className="md:hidden flex flex-wrap gap-2">
          {[
            { key: 'name', label: 'Nombre' },
            { key: 'cost', label: 'Costo' },
            { key: 'sale', label: 'Venta' },
            { key: 'stock', label: 'Stock' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onSortChange(item.key)}
              className={`h-8 px-2.5 rounded-lg border text-[10px] uppercase tracking-wide ${
                productSort?.field === item.key
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                  : 'border-white/15 bg-white/5 text-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="inline-flex items-center rounded-lg border border-white/10 overflow-hidden">
          <button
            onClick={() => setPriceCurrency('ARS')}
            className={`px-3 h-8 text-xs font-bold cursor-pointer transition-colors ${showArs ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            ARS
          </button>
          <button
            onClick={() => setPriceCurrency('USD')}
            className={`px-3 h-8 text-xs font-bold cursor-pointer transition-colors ${!showArs ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            USD
          </button>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-4">Img</th>
              <th className="p-4">
                <SortHeader label="SKU / Nombre" field="name" align="left" productSort={productSort} onSortChange={onSortChange} />
              </th>
              <th className="p-4 text-right">
                <SortHeader label={`Costo (${showArs ? 'ARS' : 'USD'})`} field="cost" align="right" productSort={productSort} onSortChange={onSortChange} />
              </th>
              <th className="p-4 text-right">
                <SortHeader label={`Venta (${showArs ? 'ARS' : 'USD'})`} field="sale" align="right" productSort={productSort} onSortChange={onSortChange} />
              </th>
              <th className="p-4 text-center">
                <SortHeader label="Stock" field="stock" align="center" productSort={productSort} onSortChange={onSortChange} />
              </th>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/2 transition-colors group">
                <td className="p-4">
                  <div className="w-12 h-12 bg-[#050507] rounded-lg overflow-hidden flex items-center justify-center p-1 border border-cyan-500/20">
                    <img src={p.imageUrl} alt="" className="max-h-full object-contain" />
                  </div>
                </td>
                <td className="p-4">
                  <span className="block font-mono text-cyan-400 text-xs">{p.sku}</span>
                  <span className="font-medium text-white line-clamp-1 max-w-[200px]">{p.name}</span>
                </td>
                <td className="p-4 text-right font-mono text-gray-400">{formatPrice(p.costPrice, null)}</td>
                <td className="p-4 text-right font-bold text-green-400">{formatPrice(p.priceUsd, p.price)}</td>
                <td className="p-4 text-center font-mono">
                  {p.quantity > 0 ? (
                    <span className="text-green-400 font-bold">{p.quantity}</span>
                  ) : (
                    <span className="text-red-500/50">-</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <StatusButton p={p} onToggle={onToggle} />
                </td>
                <td className="p-4 text-right">
                  <ActionButtons p={p} onView={onView} onEdit={onEdit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4 p-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex gap-3 shadow-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#050507] rounded-lg p-1 shrink-0 flex items-center justify-center border border-cyan-500/20">
              <img src={p.imageUrl} alt="" className="max-h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <StatusButton p={p} onToggle={onToggle} small />
              </div>
              <h3 className="text-white font-bold text-sm line-clamp-2 mb-2 leading-tight">{p.name}</h3>
              <p className="text-xs text-gray-400 mb-2">Stock: <span className="text-cyan-300 font-semibold">{p.quantity || 0}</span></p>

              <div className="flex justify-between items-end mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase">Venta ({showArs ? 'ARS' : 'USD'})</span>
                  <span className="text-green-400 font-bold text-base sm:text-lg leading-none">{formatPrice(p.priceUsd, p.price)}</span>
                </div>
                <ActionButtons p={p} onView={onView} onEdit={onEdit} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const StatusButton = ({ p, onToggle, small }) => (
  <button
    onClick={() => onToggle(p)}
    className={`${small ? 'p-1' : 'p-1.5'} rounded-lg transition-colors cursor-pointer ${p.isActive ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'}`}
    title={p.isActive ? 'Deshabilitar' : 'Habilitar'}
  >
    <Power size={small ? 14 : 16} />
  </button>
);

const ActionButtons = ({ p, onView, onEdit }) => (
  <div className="flex items-center justify-end gap-2">
    <button onClick={() => onView(p)} className="p-2 bg-black/20 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 rounded-lg cursor-pointer transition-colors"><Eye size={18} /></button>
    <button onClick={() => onEdit(p)} className="p-2 bg-black/20 hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-400 rounded-lg cursor-pointer transition-colors"><Edit size={18} /></button>
  </div>
);

const SortHeader = ({ label, field, align = 'left', productSort, onSortChange }) => {
  const isActive = productSort?.field === field;
  const isAsc = productSort?.direction === 'asc';
  const justifyClass = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';

  return (
    <button
      onClick={() => onSortChange(field)}
      className={`w-full inline-flex items-center gap-1 ${justifyClass} hover:text-cyan-300 transition-colors cursor-pointer`}
      title={`Ordenar por ${label}`}
    >
      <span>{label}</span>
      {isActive ? (isAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />) : <ArrowDown size={13} className="opacity-40" />}
    </button>
  );
};
