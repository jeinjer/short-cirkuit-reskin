import React from 'react';
import { X, MessageSquare } from 'lucide-react';

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

export default function ViewOrderModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-[#13131a] border border-white/10 rounded-2xl w-full max-w-3xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"><X/></button>

        <div className="mb-5">
          <p className="text-cyan-400 font-mono text-xs break-all">{order.id}</p>
          <h2 className="text-2xl font-bold text-white mt-1">Detalle de orden</h2>
          <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString('es-AR')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-[11px] text-gray-500 uppercase">Cliente</p>
            <p className="text-white">{order.user?.name || 'Sin nombre'}</p>
            <p className="text-xs text-gray-400">{order.user?.email}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-[11px] text-gray-500 uppercase">Estado</p>
            <p className="text-white">{statusLabel[order.status] || order.status}</p>
            <p className="text-xs text-gray-400">{paymentStatusLabel[order.paymentStatus] || order.paymentStatus}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <p className="text-[11px] text-gray-500 uppercase">Pago</p>
            <p className="text-white">{order.paymentMethod === 'LOCAL' ? 'En local' : 'Mercado Pago'}</p>
            <p className="text-xs text-gray-400">Tel: {order.phone || '-'}</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-5">
          <p className="text-sm text-gray-300 mb-3">Items</p>
          <div className="space-y-2">
            {(order.items || []).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                <div>
                  <p className="text-white">{item.name}</p>
                  <p className="text-xs text-cyan-400 font-mono">{item.sku} x{item.quantity}</p>
                </div>
                <p className="text-gray-200">${Number(item.subtotalUsd || 0).toFixed(2)} USD</p>
              </div>
            ))}
          </div>
        </div>

        {order.notes && (
          <div className="mb-5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
            <p className="text-[11px] text-yellow-400 uppercase mb-1">Notas</p>
            <p className="text-sm text-gray-300">{order.notes}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2 border-t border-white/10">
          <div>
            <p className="text-xs text-gray-500 uppercase">Total ARS</p>
            <p className="text-2xl font-black text-cyan-400">${Number(order.subtotalArs || 0).toLocaleString('es-AR')}</p>
          </div>
          <div className="flex items-center gap-2">
            {order.whatsappUrl && (
              <a href={order.whatsappUrl} target="_blank" rel="noreferrer" className="h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm inline-flex items-center gap-2">
                <MessageSquare size={16} />
                WhatsApp
              </a>
            )}
            <button onClick={onClose} className="h-10 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-bold text-sm">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
