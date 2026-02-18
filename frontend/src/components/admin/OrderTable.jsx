import React from 'react';
import { Eye } from 'lucide-react';
import CircuitLoader from '../others/CircuitLoader';

const statusLabel = {
  PENDING_PAYMENT: 'Pendiente',
  PENDING_PICKUP: 'Pendiente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado'
};

const getPaymentLabel = (paymentStatus) => {
  if (!paymentStatus) return '-';
  return paymentStatus === 'APPROVED' ? 'Realizado' : 'Pendiente';
};

const statusOptions = [
  { value: 'PENDING_PAYMENT', label: 'Pendiente' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'CANCELLED', label: 'Cancelado' }
];

const paymentOptions = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'APPROVED', label: 'Realizado' }
];

export default function OrderTable({ orders, loading, onQuickUpdate, onView }) {
  if (loading) return <div className="bg-[#13131a] p-12 flex justify-center border-x border-white/5"><CircuitLoader /></div>;
  if (orders.length === 0) return <div className="bg-[#13131a] p-8 text-center text-gray-500 border-x border-white/5">No hay órdenes</div>;

  return (
    <div className="bg-[#13131a] border-x border-b border-white/5">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-4">Pedido</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Pago</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-white/2 transition-colors">
                <td className="p-4">
                  <p className="font-mono text-cyan-400 text-xs">{o.id}</p>
                  <p className="text-gray-500 text-xs">{new Date(o.createdAt).toLocaleString('es-AR')}</p>
                </td>
                <td className="p-4">
                  <p className="text-white">{o.user?.name || 'Sin nombre'}</p>
                  <p className="text-gray-500 text-xs">{o.user?.email}</p>
                </td>
                <td className="p-4">
                  <select
                    value={o.paymentStatus || ''}
                    disabled={o.status === 'CANCELLED'}
                    onChange={(e) => onQuickUpdate(o, { paymentStatus: e.target.value || null })}
                    className="h-9 min-w-[150px] px-2 rounded-lg bg-black/40 border border-white/20 text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="">-</option>
                    {paymentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                  <select
                    value={o.status === 'PENDING_PICKUP' ? 'PENDING_PAYMENT' : o.status}
                    onChange={(e) => onQuickUpdate(o, { status: e.target.value })}
                    className="h-9 min-w-[170px] px-2 rounded-lg bg-black/40 border border-white/20 text-sm text-white"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-right font-bold text-white">${Number(o.subtotalArs || 0).toLocaleString('es-AR')}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end">
                    <button
                      onClick={() => onView(o)}
                      className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      title="Ver detalle"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3 p-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="font-mono text-[11px] text-cyan-400 break-all">{o.id}</p>
            <p className="text-white mt-1">{o.user?.name}</p>
            <p className="text-xs text-gray-500">{o.user?.email}</p>
            <div className="mt-2 flex justify-between text-xs">
              <span className="text-gray-400">{statusLabel[o.status] || o.status}</span>
              <span className="text-cyan-300">${Number(o.subtotalArs || 0).toLocaleString('es-AR')}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <select
                value={o.paymentStatus || ''}
                disabled={o.status === 'CANCELLED'}
                onChange={(e) => onQuickUpdate(o, { paymentStatus: e.target.value || null })}
                className="h-10 px-2 rounded-lg bg-black/40 border border-white/20 text-xs text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">{getPaymentLabel(o.paymentStatus)}</option>
                {paymentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={o.status === 'PENDING_PICKUP' ? 'PENDING_PAYMENT' : o.status}
                onChange={(e) => onQuickUpdate(o, { status: e.target.value })}
                className="h-10 px-2 rounded-lg bg-black/40 border border-white/20 text-xs text-white"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => onView(o)} className="flex-1 py-2 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-bold border border-cyan-500/30">Detalle</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
