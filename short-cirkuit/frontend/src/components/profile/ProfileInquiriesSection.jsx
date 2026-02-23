import React from 'react';
import { MessageSquare } from 'lucide-react';
import CircuitLoader from '../others/CircuitLoader';
import PaginationBar from '../common/PaginationBar';
import { inquiryStatusLabel, inquiryStatusStyles } from './profile.constants';

export default function ProfileInquiriesSection({
  loadingInquiries,
  inquiries,
  inquiriesMeta,
  inquiriesPage,
  setInquiriesPage,
  formatDateTimeAr
}) {
  return (
    <section className="bg-[#0f0f15] border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-cyan-300 font-bold mb-3">
        <MessageSquare size={18} />
        Mis consultas
      </div>

      <div className="space-y-3">
        {loadingInquiries ? (
          <div className="py-6 flex justify-center">
            <CircuitLoader size="sm" label="Cargando consultas" />
          </div>
        ) : inquiries.length === 0 ? (
          <p className="text-sm text-gray-400">Todavia no hiciste consultas.</p>
        ) : (
          inquiries.map((inq) => (
            <article key={inq.id} className="border border-white/10 rounded-xl p-4 bg-black/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-sm text-white">{inq.product?.name || 'Producto'}</p>
                  <p className="text-xs text-cyan-300 font-mono">{inq.product?.sku || '-'}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDateTimeAr(inq.createdAt)}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded border ${
                    inquiryStatusStyles[inq.status] || 'border-white/20 text-gray-300 bg-white/5'
                  }`}
                >
                  {inquiryStatusLabel[inq.status] || inq.status}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                  <p className="text-xs uppercase tracking-wider text-cyan-300 mb-1">Tu consulta</p>
                  <p className="text-sm text-gray-200">{inq.message || 'Sin mensaje adicional'}</p>
                </div>

                {inq.adminReply && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                    <p className="text-xs uppercase tracking-wider text-emerald-300 mb-1">
                      Respuesta del administrador
                    </p>
                    <p className="text-sm text-gray-200">{inq.adminReply}</p>
                    {inq.repliedAt && (
                      <p className="text-xs text-gray-400 mt-2">{formatDateTimeAr(inq.repliedAt)}</p>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      {!loadingInquiries && inquiriesMeta.last_page > 1 && (
        <div className="mt-4">
          <PaginationBar
            page={inquiriesPage}
            canPrev={inquiriesPage > 1}
            canNext={inquiriesPage < (inquiriesMeta.last_page || 1)}
            onPrev={() => setInquiriesPage((p) => Math.max(1, p - 1))}
            onNext={() => setInquiriesPage((p) => Math.min(inquiriesMeta.last_page || 1, p + 1))}
            totalPages={inquiriesMeta.last_page || 1}
          />
        </div>
      )}
    </section>
  );
}
