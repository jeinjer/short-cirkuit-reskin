import React from 'react';
import { CheckCircle2, XCircle, Clock3, Eye, MessageSquare } from 'lucide-react';
import CircuitLoader from '../others/CircuitLoader';

const statusLabel = {
  PENDING_PAYMENT: 'Pendiente pago',
  PENDING_PICKUP: 'Pendiente retiro',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado'
};

const paymentStatusLabel = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado'
};

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
                  <p className="text-gray-200">{o.paymentMethod === 'LOCAL' ? 'En local' : 'Mercado Pago'}</p>
                  <p className={`text-xs ${o.paymentStatus === 'APPROVED' ? 'text-emerald-400' : o.paymentStatus === 'REJECTED' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {paymentStatusLabel[o.paymentStatus] || o.paymentStatus}
                  </p>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded border ${
                    o.status === 'CONFIRMED' ? 'border-emerald-500/40 text-emerald-400' :
                    o.status === 'CANCELLED' ? 'border-red-500/40 text-red-400' :
                    'border-yellow-500/40 text-yellow-400'
                  }`}>
                    {statusLabel[o.status] || o.status}
                  </span>
                </td>
                <td className="p-4 text-right font-bold text-white">${Number(o.subtotalArs || 0).toLocaleString('es-AR')}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onView(o)}
                      className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      title="Ver detalle"
                    >
                      <Eye size={16} />
                    </button>
                    {o.whatsappUrl && (
                      <a
                        href={o.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        title="Abrir WhatsApp"
                      >
                        <MessageSquare size={16} />
                      </a>
                    )}
                    <button
                      onClick={() => onQuickUpdate(o, { status: 'PENDING_PICKUP' })}
                      className="p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      title="Pendiente retiro"
                    >
                      <Clock3 size={16} />
                    </button>
                    <button
                      onClick={() => onQuickUpdate(o, { status: 'CONFIRMED', paymentStatus: o.paymentStatus === 'APPROVED' ? 'APPROVED' : o.paymentStatus })}
                      className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      title="Confirmar"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    <button
                      onClick={() => onQuickUpdate(o, { status: 'CANCELLED' })}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30"
                      title="Cancelar"
                    >
                      <XCircle size={16} />
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
            <div className="mt-3 flex gap-2">
              <button onClick={() => onView(o)} className="flex-1 py-2 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-bold border border-cyan-500/30">Detalle</button>
              {o.whatsappUrl && <a href={o.whatsappUrl} target="_blank" rel="noreferrer" className="flex-1 py-2 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30 text-center">WhatsApp</a>}
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => onQuickUpdate(o, { status: 'CONFIRMED' })} className="flex-1 py-2 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30">Confirmar</button>
              <button onClick={() => onQuickUpdate(o, { status: 'CANCELLED' })} className="flex-1 py-2 rounded-lg bg-red-500/15 text-red-300 text-xs font-bold border border-red-500/30">Cancelar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
