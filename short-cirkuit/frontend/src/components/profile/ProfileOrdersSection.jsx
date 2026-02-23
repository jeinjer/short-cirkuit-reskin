import React from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import CircuitLoader from '../others/CircuitLoader';
import PaginationBar from '../common/PaginationBar';
import {
  getOrderExchangeRate,
  isPendingOrder,
  orderStatusLabel,
  orderStatusStyles
} from './profile.constants';

export default function ProfileOrdersSection({
  loadingOrders,
  orders,
  ordersPage,
  ordersMeta,
  onRefresh,
  onCopyOrderId,
  expandedOrderId,
  setExpandedOrderId,
  formatDateTimeAr,
  formatArs,
  setOrdersPage
}) {
  return (
    <section className="bg-[#0f0f15] border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-cyan-300 font-bold">
          <ShoppingBag size={18} />
          Mis pedidos
        </div>
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 cursor-pointer"
          title="Actualizar"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {loadingOrders ? (
          <div className="py-6 flex justify-center">
            <CircuitLoader size="sm" label="Cargando pedidos" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-400">Todavia no tenes pedidos.</p>
        ) : (
          orders.map((order) => (
            <article key={order.id} className="border border-white/10 rounded-xl p-4 bg-black/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-mono text-cyan-300 break-all text-sm">#{order.id}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDateTimeAr(order.createdAt)}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`text-xs px-2 py-1 rounded border ${
                      orderStatusStyles[order.status] || 'border-white/20 text-gray-300 bg-white/5'
                    }`}
                  >
                    {orderStatusLabel[order.status] || order.status}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  Total: <strong className="text-white">{formatArs(order.subtotalArs)}</strong>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onCopyOrderId(order.id)}
                    className="h-10 px-3 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20 inline-flex items-center gap-2 text-sm font-semibold cursor-pointer"
                  >
                    <Copy size={15} />
                    Copiar num. pedido
                  </button>
                  <button
                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                    className="h-10 px-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-gray-200 inline-flex items-center gap-2 text-sm font-semibold cursor-pointer"
                  >
                    {expandedOrderId === order.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    {expandedOrderId === order.id ? 'Ocultar detalle' : 'Ver detalle'}
                  </button>
                </div>
              </div>

              {expandedOrderId === order.id && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                  <div className="space-y-2">
                    {(order.items || []).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                        <div>
                          <p className="text-white">{item.name}</p>
                          <p className="text-xs text-cyan-300 font-mono">Cantidad: {item.quantity}</p>
                        </div>
                        <p className="text-gray-300">
                          {formatArs((Number(item.subtotalUsd) || 0) * getOrderExchangeRate(order))}
                        </p>
                      </div>
                    ))}
                  </div>

                  {isPendingOrder(order.status) && (
                    <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-cyan-200 font-semibold mb-2">
                        <ShieldCheck size={16} />
                        Como seguir con tu pedido
                      </div>
                      <ol className="space-y-1 text-sm text-gray-300 list-decimal pl-5">
                        <li>Haz clic en "Continuar".</li>
                        <li>Envia el mensaje prearmado.</li>
                        <li>Validaremos el pedido y nos pondremos en contacto lo antes posible.</li>
                      </ol>
                      {order.whatsappUrl && (
                        <a
                          href={order.whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 h-10 px-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 inline-flex items-center gap-2 text-sm font-semibold cursor-pointer"
                        >
                          <MessageSquare size={15} />
                          Continuar
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {!loadingOrders && ordersMeta.last_page > 1 && (
        <div className="mt-4">
          <PaginationBar
            page={ordersPage}
            canPrev={ordersPage > 1}
            canNext={ordersPage < (ordersMeta.last_page || 1)}
            onPrev={() => setOrdersPage((p) => Math.max(1, p - 1))}
            onNext={() => setOrdersPage((p) => Math.min(ordersMeta.last_page || 1, p + 1))}
            totalPages={ordersMeta.last_page || 1}
          />
        </div>
      )}
    </section>
  );
}
