import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../../api/axios';
import CircuitLoader from '../others/CircuitLoader';

const inquiryStatusLabel = {
  PENDING: 'Pendiente',
  REPLIED: 'Respondida'
};

const STATUS_FILTERS = [
  { key: 'PENDING', label: 'Pendientes' },
  { key: 'REPLIED', label: 'Respondidas' }
];

export default function InquiryTable({
  statusFilter = 'PENDING',
  onStatusChange,
  page = 1,
  onPageChange
}) {
  const [inquiries, setInquiries] = useState([]);
  const [pageInput, setPageInput] = useState(String(page));
  const [meta, setMeta] = useState({ page: 1, limit: 10, has_next_page: false, status: 'PENDING' });
  const [replyById, setReplyById] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedById, setExpandedById] = useState({});

  const loadInquiries = async (targetPage = page, targetStatus = statusFilter) => {
    try {
      setLoading(true);
      const res = await api.get('/inquiries', {
        params: { page: targetPage, limit: 10, status: targetStatus }
      });
      setInquiries(res.data?.data || []);
      setMeta(res.data?.meta || { page: targetPage, limit: 10, has_next_page: false, status: targetStatus });
    } catch (error) {
      toast.error('No se pudieron cargar las consultas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries(page, statusFilter);
  }, [page, statusFilter]);

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const safeSetPage = (nextPage) => {
    if (typeof onPageChange === 'function') {
      onPageChange(nextPage);
    }
  };

  const safeSetStatus = (nextStatus) => {
    if (typeof onStatusChange === 'function') {
      onStatusChange(nextStatus);
    }
  };

  const goToPage = () => {
    const parsed = Number(pageInput);
    if (!Number.isFinite(parsed)) return;
    const target = Math.max(1, Math.trunc(parsed));
    safeSetPage(target);
  };

  const setFilter = (nextStatus) => {
    if (nextStatus === statusFilter) return;
    safeSetStatus(nextStatus);
    safeSetPage(1);
    setExpandedById({});
  };

  const handleReply = async (inquiryId) => {
    const reply = replyById[inquiryId]?.trim();
    if (!reply) {
      toast.error('Escribe una respuesta antes de enviar');
      return;
    }

    try {
      setSavingId(inquiryId);
      await api.patch(`/inquiries/${inquiryId}/reply`, { reply });
      setReplyById((prev) => ({ ...prev, [inquiryId]: '' }));
      toast.success('Consulta respondida');
      await loadInquiries(page, statusFilter);
    } catch (error) {
      toast.error('No se pudo responder la consulta');
    } finally {
      setSavingId(null);
    }
  };

  const handleToggle = async (inquiry) => {
    const inquiryId = inquiry.id;
    const isExpanded = !!expandedById[inquiryId];
    setExpandedById((prev) => ({ ...prev, [inquiryId]: !isExpanded }));
  };

  return (
    <div className="space-y-3">
      <div className="bg-[#13131a] border border-white/5 rounded-xl p-3 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`h-9 px-3 rounded-lg border text-xs font-bold uppercase transition-colors ${
              statusFilter === f.key
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                : 'border-white/15 bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex justify-center">
          <CircuitLoader size="sm" label="Cargando consultas" />
        </div>
      ) : !inquiries.length ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-400">
          No hay consultas en estado {inquiryStatusLabel[statusFilter]?.toLowerCase() || statusFilter.toLowerCase()}.
        </div>
      ) : (
        inquiries.map((iq) => (
          <article key={iq.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-500/30 bg-cyan-500/10 shrink-0">
                  {iq.user?.avatar ? (
                    <img src={iq.user.avatar} alt="Avatar cliente" className="w-full h-full object-cover opacity-90" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-300 font-bold">
                      {(iq.user?.name || iq.name || 'C').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-semibold">{iq.product?.name || 'Producto sin nombre'}</p>
                  <p className="text-xs text-gray-400">{iq.product?.sku || '-'} | {new Date(iq.createdAt).toLocaleString('es-AR')}</p>
                  <p className="text-xs text-gray-500 mt-1">Cliente: {iq.user?.name || iq.name} ({iq.user?.email || iq.email})</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded border border-white/20 bg-white/5 text-gray-300">
                  {inquiryStatusLabel[iq.status] || iq.status}
                </span>
                <button
                  onClick={() => handleToggle(iq)}
                  className="h-8 px-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-xs"
                >
                  {expandedById[iq.id] ? 'Ocultar' : 'Abrir'}
                </button>
              </div>
            </div>

            {expandedById[iq.id] && (
              <div className="mt-3 space-y-2">
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3">
                  <p className="text-xs uppercase tracking-wider text-cyan-300 mb-1">Consulta del cliente</p>
                  <p className="text-sm text-gray-200">{iq.message || 'Sin mensaje adicional'}</p>
                </div>

                {iq.adminReply ? (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                    <p className="text-xs uppercase tracking-wider text-emerald-300 mb-1">Respuesta del admin</p>
                    <p className="text-sm text-gray-200">{iq.adminReply}</p>
                    {iq.repliedAt && <p className="text-xs text-gray-400 mt-2">{new Date(iq.repliedAt).toLocaleString('es-AR')}</p>}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={replyById[iq.id] || ''}
                      onChange={(e) => setReplyById((prev) => ({ ...prev, [iq.id]: e.target.value }))}
                      placeholder="Escribe la respuesta para esta consulta"
                      className="w-full h-28 rounded-lg border border-white/20 bg-black/30 p-3 text-sm"
                    />
                    <button
                      onClick={() => handleReply(iq.id)}
                      disabled={savingId === iq.id}
                      className="h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold disabled:opacity-60"
                    >
                      {savingId === iq.id ? 'Enviando...' : 'Responder'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </article>
        ))
      )}

      {(page > 1 || meta.has_next_page) && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => safeSetPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="h-9 px-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-sm disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-xs text-gray-400">
            Pagina <span className="text-white">{page}</span>
          </span>
          <button
            onClick={() => safeSetPage(page + 1)}
            disabled={!meta.has_next_page}
            className="h-9 px-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-sm disabled:opacity-40"
          >
            Siguiente
          </button>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-20 h-9 px-2 rounded-lg bg-black/40 border border-white/20 text-sm text-white"
            />
            <button
              onClick={goToPage}
              className="h-9 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase"
            >
              Ir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
