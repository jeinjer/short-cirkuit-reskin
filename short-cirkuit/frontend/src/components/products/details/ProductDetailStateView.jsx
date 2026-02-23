import React from 'react';

import CircuitLoader from '../../others/CircuitLoader';

const stateConfig = {
  not_found: {
    title: 'Producto no disponible',
    description: 'Este producto no existe o no está disponible en este momento.',
    primaryLabel: 'Ir al catálogo',
    secondaryLabel: 'Volver al inicio',
  },
  generic: {
    title: 'Error al cargar producto',
    description: 'Ocurrió un problema al consultar este producto. Inténtalo nuevamente.',
    primaryLabel: 'Reintentar',
    secondaryLabel: 'Ir al catálogo',
  },
};

export default function ProductDetailStateView({
  type,
  onPrimaryAction,
  onSecondaryAction,
}) {
  if (type === 'loading') {
    return (
      <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center">
        <CircuitLoader size="lg" />
      </div>
    );
  }

  const config = stateConfig[type];
  if (!config) return null;

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
          {config.title}
        </h1>
        <p className="mt-3 text-gray-300">{config.description}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPrimaryAction}
            className="h-11 px-5 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-bold flex-1"
          >
            {config.primaryLabel}
          </button>
          <button
            onClick={onSecondaryAction}
            className="h-11 px-5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 font-semibold flex-1"
          >
            {config.secondaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
