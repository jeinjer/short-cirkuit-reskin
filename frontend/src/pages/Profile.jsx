import React, { useEffect, useMemo, useState } from 'react';
import {
  Copy,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  UserCircle2,
  Mail,
  Trash2,
  Save,
  PanelsTopLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CircuitLoader from '../components/others/CircuitLoader';

const TABS = {
  ACCOUNT: 'ACCOUNT',
  ORDERS: 'ORDERS',
  INQUIRIES: 'INQUIRIES'
};

const TAB_QUERY = {
  ACCOUNT: 'cuenta',
  ORDERS: 'pedidos',
  INQUIRIES: 'consultas'
};

const QUERY_TAB = {
  cuenta: TABS.ACCOUNT,
  pedidos: TABS.ORDERS,
  consultas: TABS.INQUIRIES
};

const AVATAR_OPTIONS = [
  // Caras genericas estilo blob/cartoon
  'https://api.dicebear.com/9.x/thumbs/svg?seed=HappySun',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=SleepyMoon',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=WinkWave',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=CoolStar',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=CherryPop',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=MintDrop',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=BlueBloop',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=PixelBean'
];

const orderStatusLabel = {
  PENDING_PAYMENT: 'Pendiente',
  PENDING_PICKUP: 'Pendiente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado'
};

const inquiryStatusLabel = {
  PENDING: 'Pendiente',
  REPLIED: 'Respondida'
};

const orderStatusStyles = {
  PENDING_PAYMENT: 'border-yellow-500/40 text-yellow-300 bg-yellow-500/10',
  PENDING_PICKUP: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
  CONFIRMED: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
  CANCELLED: 'border-red-500/40 text-red-300 bg-red-500/10'
};

const inquiryStatusStyles = {
  PENDING: 'border-yellow-500/40 text-yellow-300 bg-yellow-500/10',
  REPLIED: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
};

const isPendingOrder = (status) => status === 'PENDING_PAYMENT' || status === 'PENDING_PICKUP';
const formatArs = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
const formatDateTimeAr = (value) =>
  new Date(value).toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires'
  });
const getOrderExchangeRate = (order) => {
  const explicitRate = Number(order?.exchangeRate);
  if (explicitRate > 0) return explicitRate;

  const totalUsd = Number(order?.subtotalUsd);
  const totalArs = Number(order?.subtotalArs);
  if (totalUsd > 0 && totalArs > 0) return totalArs / totalUsd;

  return 0;
};

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, refreshUser } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [tab, setTab] = useState(() => QUERY_TAB[searchParams.get('tab')] || TABS.ACCOUNT);
  const [orders, setOrders] = useState([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersMeta, setOrdersMeta] = useState({ total: 0, page: 1, last_page: 1 });
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesPage, setInquiriesPage] = useState(1);
  const [inquiriesMeta, setInquiriesMeta] = useState({ total: 0, page: 1, last_page: 1 });
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [isSwitchingTab, setIsSwitchingTab] = useState(false);

  const firstName = useMemo(() => user?.name?.split(' ')[0] || 'Cliente', [user]);

  const loadProfileData = async () => {
    try {
      const meRes = await api.get('/auth/me');
      setSelectedAvatar(meRes.data?.avatar || '');
    } catch (error) {
      toast.error('No se pudo cargar tu perfil');
    }
  };

  const loadOrders = async (page = ordersPage) => {
    try {
      setLoadingOrders(true);
      const ordersRes = await api.get('/checkout/orders/my', {
        params: { page, limit: 5 }
      });
      setOrders(ordersRes.data?.data || []);
      setOrdersMeta(ordersRes.data?.meta || { total: 0, page, last_page: 1 });
    } catch (error) {
      toast.error('No se pudo cargar tus pedidos');
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadInquiries = async (page = inquiriesPage) => {
    try {
      setLoadingInquiries(true);
      const inquiriesRes = await api.get('/inquiries/me', {
        params: { page, limit: 5 }
      });
      setInquiries(inquiriesRes.data?.data || []);
      setInquiriesMeta(inquiriesRes.data?.meta || { total: 0, page, last_page: 1 });
    } catch (error) {
      toast.error('No se pudo cargar tus consultas');
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    if (isAdmin) return;
    loadOrders(ordersPage);
  }, [ordersPage, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    loadInquiries(inquiriesPage);
  }, [inquiriesPage, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      if (tab !== TABS.ACCOUNT) setTab(TABS.ACCOUNT);
      if (searchParams.get('tab') !== TAB_QUERY.ACCOUNT) {
        setSearchParams({ tab: TAB_QUERY.ACCOUNT });
      }
      return;
    }
    const queryTab = QUERY_TAB[searchParams.get('tab')];
    if (queryTab && queryTab !== tab) {
      setTab(queryTab);
    }
  }, [searchParams, tab, isAdmin, setSearchParams]);

  const selectTab = (nextTab) => {
    if (isAdmin) return;
    setIsSwitchingTab(true);
    setTab(nextTab);
    setSearchParams({ tab: TAB_QUERY[nextTab] });
    setTimeout(() => setIsSwitchingTab(false), 180);
  };

  const copyOrderId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success('Número de pedido copiado');
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  const saveProfile = async () => {
    try {
      setSavingProfile(true);
      await api.patch('/auth/me', {
        avatar: selectedAvatar || null
      });
      await refreshUser();
      toast.success('Perfil actualizado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo actualizar el perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setSavingProfile(true);
      await api.patch('/auth/me', { avatar: null });
      setSelectedAvatar('');
      await refreshUser();
      toast.success('Avatar eliminado');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo eliminar el avatar');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050507] text-white pt-24 md:pt-28 pb-12 md:pb-16 overflow-x-clip">
      <div className="container mx-auto px-4 max-w-6xl space-y-6">
        <section className="rounded-2xl border border-cyan-500/20 bg-linear-to-b from-cyan-500/10 to-transparent p-6">
          <p className="text-cyan-300 text-xs uppercase tracking-widest font-mono">Perfil</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-cyber uppercase tracking-tight mt-2">Mi cuenta</h1>
          <p className="text-gray-300 mt-3 max-w-3xl">
            Hola {firstName}. {isAdmin ? 'Gestiona tu perfil desde esta sección.' : 'Gestiona tu perfil, pedidos y consultas desde secciones separadas.'}
          </p>
        </section>

        {!isAdmin && (
        <section className="bg-[#0f0f15] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-cyan-300 font-bold mb-3">
            <PanelsTopLeft size={16} />
            Secciones
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => selectTab(TABS.ACCOUNT)}
              className={`h-11 rounded-lg border text-sm font-bold transition-colors cursor-pointer ${tab === TABS.ACCOUNT ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200' : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'}`}
            >
              Mi cuenta
            </button>
            <button
              onClick={() => selectTab(TABS.ORDERS)}
              className={`h-11 rounded-lg border text-sm font-bold transition-colors cursor-pointer ${tab === TABS.ORDERS ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200' : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'}`}
            >
              Mis pedidos
            </button>
            <button
              onClick={() => selectTab(TABS.INQUIRIES)}
              className={`h-11 rounded-lg border text-sm font-bold transition-colors cursor-pointer ${tab === TABS.INQUIRIES ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200' : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'}`}
            >
              Mis consultas
            </button>
          </div>
        </section>
        )}

        {isSwitchingTab && !isAdmin && (
          <section className="bg-[#0f0f15] border border-white/10 rounded-2xl p-8 flex justify-center">
            <CircuitLoader size="sm" label="Cargando sección" />
          </section>
        )}

        {!isSwitchingTab && tab === TABS.ACCOUNT && (
          <section className="bg-[#0f0f15] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-cyan-300 font-bold mb-4">
              <UserCircle2 size={18} />
              Datos del perfil
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-1">
                <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-3">
                  {selectedAvatar ? (
                    <img src={selectedAvatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border border-cyan-500/30 bg-white" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-black text-2xl">
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white">{user?.name || '-'}</p>
                    <p className="text-xs text-gray-400">{user?.email || '-'}</p>
                  </div>
                  <button
                    onClick={removeAvatar}
                    disabled={savingProfile}
                    className="h-9 px-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20 inline-flex items-center gap-2 text-sm font-semibold disabled:opacity-50 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Quitar avatar
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Elegí tu avatar</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-2">
                    {AVATAR_OPTIONS.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`p-1 rounded-lg border cursor-pointer transition-colors ${selectedAvatar === avatar ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                      >
                        <img src={avatar} alt="avatar-option" className="w-full aspect-square rounded-md bg-white" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={saveProfile}
                  disabled={savingProfile}
                  className="h-11 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Save size={15} />
                  Guardar cambios
                </button>
              </div>
            </div>
          </section>
        )}

        {!isSwitchingTab && !isAdmin && tab === TABS.ORDERS && (
          <section className="bg-[#0f0f15] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <ShoppingBag size={18} />
                Mis pedidos
              </div>
              <button onClick={() => loadOrders(ordersPage)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 cursor-pointer" title="Actualizar">
                <RefreshCw size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {loadingOrders ? (
                <div className="py-6 flex justify-center">
                  <CircuitLoader size="sm" label="Cargando pedidos" />
                </div>
              ) : orders.length === 0 ? (
                <p className="text-sm text-gray-400">Todavía no tenés pedidos.</p>
              ) : (
                orders.map((order) => (
                  <article key={order.id} className="border border-white/10 rounded-xl p-4 bg-black/20">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="font-mono text-cyan-300 break-all text-sm">#{order.id}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDateTimeAr(order.createdAt)}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded border ${orderStatusStyles[order.status] || 'border-white/20 text-gray-300 bg-white/5'}`}>
                          {orderStatusLabel[order.status] || order.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-300">Total: <strong className="text-white">{formatArs(order.subtotalArs)}</strong></span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyOrderId(order.id)}
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
                              <p className="text-gray-300">{formatArs((Number(item.subtotalUsd) || 0) * getOrderExchangeRate(order))}</p>
                            </div>
                          ))}
                        </div>

                        {isPendingOrder(order.status) && (
                          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-cyan-200 font-semibold mb-2">
                              <ShieldCheck size={16} />
                              Cómo seguir con tu pedido
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
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                  disabled={ordersPage <= 1}
                  className="h-9 px-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-sm disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="text-xs text-gray-400">
                  Página <span className="text-white">{ordersPage}</span> de {ordersMeta.last_page || 1}
                </span>
                <button
                  onClick={() => setOrdersPage((p) => Math.min(ordersMeta.last_page || 1, p + 1))}
                  disabled={ordersPage >= (ordersMeta.last_page || 1)}
                  className="h-9 px-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-sm disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            )}
          </section>
        )}

        {!isSwitchingTab && !isAdmin && tab === TABS.INQUIRIES && (
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
                <p className="text-sm text-gray-400">Todavía no hiciste consultas.</p>
              ) : (
                inquiries.map((inq) => (
                  <article key={inq.id} className="border border-white/10 rounded-xl p-4 bg-black/20">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <p className="text-sm text-white">{inq.product?.name || 'Producto'}</p>
                        <p className="text-xs text-cyan-300 font-mono">{inq.product?.sku || '-'}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDateTimeAr(inq.createdAt)}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded border ${inquiryStatusStyles[inq.status] || 'border-white/20 text-gray-300 bg-white/5'}`}>
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
                          <p className="text-xs uppercase tracking-wider text-emerald-300 mb-1">Respuesta del administrador</p>
                          <p className="text-sm text-gray-200">{inq.adminReply}</p>
                          {inq.repliedAt && (
                            <p className="text-xs text-gray-400 mt-2">
                              {formatDateTimeAr(inq.repliedAt)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
            {!loadingInquiries && inquiriesMeta.last_page > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setInquiriesPage((p) => Math.max(1, p - 1))}
                  disabled={inquiriesPage <= 1}
                  className="h-9 px-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-sm disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="text-xs text-gray-400">
                  Página <span className="text-white">{inquiriesPage}</span> de {inquiriesMeta.last_page || 1}
                </span>
                <button
                  onClick={() => setInquiriesPage((p) => Math.min(inquiriesMeta.last_page || 1, p + 1))}
                  disabled={inquiriesPage >= (inquiriesMeta.last_page || 1)}
                  className="h-9 px-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-sm disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}



