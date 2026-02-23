import React from 'react';

export default function ProductInquirySection({
  inquiryRef,
  inquirySubmitted,
  inquiryMessage,
  setInquiryMessage,
  submitInquiry,
  inquirySubmitting,
  trimmedInquiryMessage,
  onClose,
}) {
  return (
    <section
      ref={inquiryRef}
      className="mt-10 md:mt-12 max-w-3xl mx-auto rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 sm:p-6"
    >
      <h2 className="text-xl font-black font-cyber uppercase tracking-wider text-cyan-200">
        Consulta por este producto
      </h2>
      <p className="text-sm text-gray-300 mt-2">
        Tu consulta quedará visible en la sección de "Mis consultas" en "Mi perfil".
      </p>

      {inquirySubmitted ? (
        <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-sm text-emerald-200 font-semibold">Consulta enviada correctamente.</p>
        </div>
      ) : (
        <form onSubmit={submitInquiry} className="mt-4 space-y-3">
          <textarea
            value={inquiryMessage}
            onChange={(event) => setInquiryMessage(event.target.value)}
            placeholder="Escribe tu consulta"
            required
            className="w-full h-32 p-3 rounded-lg bg-black/50 border border-white/15 focus:border-cyan-500/40 outline-none"
          />
          <div className="flex flex-row gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 font-semibold flex-1"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={inquirySubmitting || !trimmedInquiryMessage}
              className="h-11 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 font-bold flex-1"
            >
              {inquirySubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
