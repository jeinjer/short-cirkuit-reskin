import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, MessageSquare, Phone } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CircuitLoader from '../components/others/CircuitLoader';

export default function CheckoutPage() {
  const { items, summary, fetchCart, loading: cartLoading } = useCart();
  const { user } = useAuth();

  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  const hasItems = items.length > 0;
  const isCliente = user?.role === 'CLIENTE';

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const formatArs = (value) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(Number(value) || 0);

  const trimmedPhone = phone.trim();
  const hasValidOptionalPhone = !trimmedPhone || trimmedPhone.length >= 6;
  const checkoutPhonePayload = trimmedPhone || 'NO_INFORMADO';

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!hasItems) return;
    if (!hasValidOptionalPhone) {
      toast.error('Si ingresas telefono, debe tener al menos 6 caracteres');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/checkout', {
        phone: checkoutPhonePayload
      });

      setCheckoutResult(res.data);
      await fetchCart();
      toast.success('Pedido generado. Continua por WhatsApp');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo generar el pedido');
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
            Volver al catalogo
          </Link>
          <h1 className="mt-3 text-4xl md:text-5xl font-black font-cyber uppercase tracking-tight">Checkout</h1>
          <p className="text-gray-400 mt-2">Finaliza tu compra, {displayName}.</p>
        </div>

        {!isCliente ? (
          <section className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6">
            <p className="text-gray-300">Solo los usuarios con rol cliente pueden realizar compras desde checkout.</p>
          </section>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 rounded-2xl border border-cyan-500/20 bg-[#0d0d12] p-5 md:p-6">
            <h2 className="text-xl font-bold mb-2">Datos de compra</h2>
            <p className="text-sm text-gray-400 mb-5">Generamos tu pedido y lo continuaremos por WhatsApp para coordinar pago y envio/retiro.</p>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <label className="text-xs uppercase tracking-wider text-gray-500 mb-2 inline-flex items-center gap-2">
                  <Phone size={14} className="text-cyan-400" />
                  Telefono de contacto (opcional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ingresa tu número sin 0 ni 15"
                  className="w-full h-12 px-4 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Podes dejarlo vacio y continuar igual.
                </p>
                {!hasValidOptionalPhone && (
                  <p className="mt-2 text-xs text-red-300">Telefono invalido. Minimo 6 caracteres.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!hasItems || submitting || !hasValidOptionalPhone}
                className="w-full h-12 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(6,182,212,0.25)]"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Generar pedido
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
                  Continuar
                </a>
              </div>
            )}
          </section>

          <aside className="bg-[#0d0d12] border border-cyan-500/20 rounded-2xl p-5 md:p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {cartLoading ? (
                <div className="py-6 flex justify-center">
                  <CircuitLoader size="sm" label="Cargando carrito" />
                </div>
              ) : hasItems ? (
                items.map((item) => (
                  <div key={item.id} className="border border-white/10 rounded-lg p-3 bg-black/20 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-[#050507] border border-cyan-500/20 p-1 shrink-0 flex items-center justify-center">
                      <img src={item.product.imageUrl} alt={item.product.name} className="max-h-full object-contain" />
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
        </div>
        )}
      </div>
    </main>
  );
}
