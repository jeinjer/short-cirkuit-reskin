import React from 'react';
import { Loader2, MessageSquare, Phone } from 'lucide-react';

export default function CheckoutFormSection({
  hasItems,
  phone,
  setPhone,
  submitting,
  hasValidOptionalPhone,
  submitCheckout,
  checkoutResult,
}) {
  return (
    <section className="lg:col-span-2 rounded-2xl border border-cyan-500/20 bg-[#0d0d12] p-5 md:p-6">
      <h2 className="text-xl font-bold mb-2">Datos de compra</h2>
      <p className="text-sm text-gray-400 mb-5">
        Generamos tu pedido y lo continuaremos por WhatsApp para coordinar pago y envío/retiro.
      </p>

      <form onSubmit={submitCheckout} className="space-y-5">
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <label className="text-xs uppercase tracking-wider text-gray-500 mb-2 inline-flex items-center gap-2">
            <Phone size={14} className="text-cyan-400" />
            Teléfono de contacto (opcional)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Ingresá tu número sin 0 ni 15"
            className="w-full h-12 px-4 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50"
          />
          <p className="mt-2 text-xs text-gray-500">Podés dejarlo vacío y continuar igual.</p>
          {!hasValidOptionalPhone && (
            <p className="mt-2 text-xs text-red-300">Teléfono inválido. Mínimo 6 caracteres.</p>
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
          <p className="text-sm text-emerald-300 mb-3">
            Pedido #{checkoutResult.orderId} generado correctamente.
          </p>
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
  );
}
