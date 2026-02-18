import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, MessageSquare, Store, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CircuitLoader from '../components/others/CircuitLoader';

export default function CheckoutPage() {
  const { items, summary, fetchCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('LOCAL');
  const [submitting, setSubmitting] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  const hasItems = items.length > 0;
  const isCliente = user?.role === 'CLIENTE';

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (!paymentStatus) return;
    if (paymentStatus === 'success') toast.success('Pago aprobado. Pedido confirmado.');
    if (paymentStatus === 'pending') toast.message('Pago pendiente de confirmación.');
    if (paymentStatus === 'failure') toast.error('No se pudo completar el pago.');
  }, [searchParams]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!hasItems) return;
    if (!phone.trim()) {
      toast.error('Completá tu teléfono');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/checkout', {
        paymentMethod,
        phone: phone.trim(),
        notes: notes.trim()
      });

      setCheckoutResult(res.data);
      await fetchCart();

      if (paymentMethod === 'MERCADO_PAGO' && res.data?.mercadoPago?.initPoint) {
        window.location.href = res.data.mercadoPago.initPoint;
        return;
      }

      toast.success('Pedido generado. Coordiná por WhatsApp');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo generar el checkout');
    } finally {
      setSubmitting(false);
    }
  };

  const displayName = useMemo(() => user?.name?.split(' ')[0] || 'Cliente', [user]);

  return (
    <main className="min-h-screen bg-[#050507] text-white pt-28 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link to="/catalogo" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
            <ArrowLeft size={18} />
            Volver al catálogo
          </Link>
          <h1 className="mt-3 text-4xl md:text-5xl font-black font-cyber uppercase tracking-tight">Checkout</h1>
          <p className="text-gray-400 mt-2">Finalizá tu compra, {displayName}.</p>
        </div>

        {!isCliente ? (
          <section className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6">
            <p className="text-gray-300">Solo los usuarios con rol cliente pueden realizar compras desde checkout.</p>
          </section>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-[#0d0d12] border border-white/10 rounded-2xl p-5 md:p-6">
            <h2 className="text-xl font-bold mb-4">Datos de compra</h2>

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Teléfono de contacto</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+54 9 ..."
                  className="w-full h-12 px-4 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Notas (opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Horario de retiro / referencia para envío..."
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Método de pago</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('LOCAL')}
                    className={`p-4 rounded-xl border text-left transition-colors ${paymentMethod === 'LOCAL' ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-2 text-white font-bold"><Store size={18} /> Pago en el local</div>
                    <p className="text-xs text-gray-400 mt-1">Confirmás pedido y pagás al retirar.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('MERCADO_PAGO')}
                    className={`p-4 rounded-xl border text-left transition-colors ${paymentMethod === 'MERCADO_PAGO' ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-2 text-white font-bold"><Wallet size={18} /> Mercado Pago</div>
                    <p className="text-xs text-gray-400 mt-1">Te redirigimos al checkout de Mercado Pago.</p>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!hasItems || submitting}
                className="w-full h-12 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed font-black uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {paymentMethod === 'LOCAL' ? 'Confirmar pedido' : 'Ir a Mercado Pago'}
              </button>
            </form>

            {checkoutResult?.whatsappUrl && (
              <div className="mt-5 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                <p className="text-sm text-emerald-300 mb-3">Pedido #{checkoutResult.orderId} generado correctamente.</p>
                <a
                  href={checkoutResult.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm"
                >
                  <MessageSquare size={16} />
                  Coordinar envío por WhatsApp
                </a>
              </div>
            )}
          </section>

          <aside className="bg-[#0d0d12] border border-white/10 rounded-2xl p-5 md:p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {cartLoading ? (
                <div className="py-6 flex justify-center">
                  <CircuitLoader size="sm" label="Cargando carrito" />
                </div>
              ) : hasItems ? (
                items.map((item) => (
                  <div key={item.id} className="border border-white/10 rounded-lg p-3 bg-black/20">
                    <p className="text-[11px] text-cyan-500 font-mono">{item.product.sku}</p>
                    <p className="text-sm line-clamp-2">{item.product.name}</p>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                      <span>x{item.quantity}</span>
                      <span>${Number(item.subtotalArs || 0).toLocaleString('es-AR')}</span>
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
                <span className="font-bold">Total ARS</span>
                <span className="font-black text-cyan-400">${summary.totalArs.toLocaleString('es-AR')}</span>
              </div>
            </div>
          </aside>
        </div>
        )}
      </div>
    </main>
  );
}
