import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import CheckoutFormSection from '../components/checkout/CheckoutFormSection';
import CheckoutSummaryPanel from '../components/checkout/CheckoutSummaryPanel';
import useCheckoutPageController from '../hooks/pages/useCheckoutPageController';

export default function CheckoutPage() {
  const checkoutPage = useCheckoutPageController();

  return (
    <main className="min-h-screen bg-[#050507] text-white pt-24 md:pt-28 pb-12 md:pb-16 overflow-x-clip">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft size={18} />
            Volver al catálogo
          </Link>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black font-cyber uppercase tracking-tight">
            Checkout
          </h1>
          <p className="text-gray-400 mt-2">Finaliza tu compra, {checkoutPage.displayName}.</p>
        </div>

        {!checkoutPage.isCliente ? (
          <section className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6">
            <p className="text-gray-300">
              Solo los usuarios con rol cliente pueden realizar compras desde checkout.
            </p>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            <CheckoutFormSection
              hasItems={checkoutPage.hasItems}
              phone={checkoutPage.phone}
              setPhone={checkoutPage.setPhone}
              submitting={checkoutPage.submitting}
              hasValidOptionalPhone={checkoutPage.hasValidOptionalPhone}
              submitCheckout={checkoutPage.submitCheckout}
              checkoutResult={checkoutPage.checkoutResult}
            />

            <CheckoutSummaryPanel
              items={checkoutPage.items}
              summary={checkoutPage.summary}
              cartLoading={checkoutPage.cartLoading}
              hasItems={checkoutPage.hasItems}
            />
          </div>
        )}
      </div>
    </main>
  );
}
