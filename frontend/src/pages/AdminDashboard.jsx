import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner'; 
import api from '../api/axios';
import { Package, MessageSquare, ReceiptText } from 'lucide-react';

import AdminStats from '../components/admin/AdminStats';
import AdminToolbar from '../components/admin/AdminToolbar';
import ProductTable from '../components/admin/ProductTable';
import ViewProductModal from '../components/admin/modals/ViewProductModal';
import EditProductModal from '../components/admin/modals/EditProductModal';
import ViewOrderModal from '../components/admin/modals/ViewOrderModal';
import InquiryTable from '../components/admin/InquiryTable';
import ConfirmModal from '../components/others/ConfirmModal'; 
import OrderTable from '../components/admin/OrderTable';

const TAB_QUERY = {
  products: 'productos',
  inquiries: 'consultas',
  orders: 'ordenes'
};

const QUERY_TAB = {
  productos: 'products',
  consultas: 'inquiries',
  ordenes: 'orders'
};

const INQUIRY_STATUSES = ['PENDING', 'READ', 'REPLIED'];

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({ users: 0, products: 0 });
  const [dolarValue, setDolarValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get('page')) || 1));
  const [productPageInput, setProductPageInput] = useState('1');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState(() => QUERY_TAB[searchParams.get('tab')] || 'products'); 
  const [orderSearch, setOrderSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersMeta, setOrdersMeta] = useState({ page: 1, limit: 20, has_next_page: false });
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPage, setOrdersPage] = useState(() => Math.max(1, Number(searchParams.get('page')) || 1));
  const [ordersPageInput, setOrdersPageInput] = useState('1');
  const [inquiriesPage, setInquiriesPage] = useState(() => Math.max(1, Number(searchParams.get('page')) || 1));
  const [inquiriesStatus, setInquiriesStatus] = useState(() => {
    const raw = String(searchParams.get('status') || '').toUpperCase();
    return INQUIRY_STATUSES.includes(raw) ? raw : 'PENDING';
  });
  const [viewOrder, setViewOrder] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [priceCurrency, setPriceCurrency] = useState('ARS');
  const [productSort, setProductSort] = useState({ field: 'sale', direction: 'asc' });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [statsRes, dolarRes] = await Promise.all([
            api.get('/stats'), 
            api.get('/dolar')  
        ]);
        setStats(statsRes.data);
        setDolarValue(dolarRes.data.rate);
      } catch (e) { console.error("Error metrics", e); }
    };
    fetchMetrics();
  }, []);

  useEffect(() => {
    const queryTab = QUERY_TAB[searchParams.get('tab')];
    if (queryTab && queryTab !== activeTab) {
      setActiveTab(queryTab);
      return;
    }

    if (!queryTab) {
      const expected = TAB_QUERY[activeTab] || TAB_QUERY.products;
      if (searchParams.get('tab') !== expected) {
        const next = new URLSearchParams(searchParams);
        next.set('tab', expected);
        setSearchParams(next, { replace: true });
      }
    }
  }, [searchParams, activeTab, setSearchParams]);

  useEffect(() => {
    if (activeTab !== 'products') return;
    const compactPage = Math.max(1, Number(searchParams.get('page')) || 1);
    if (compactPage !== page) setPage(compactPage);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab !== 'orders') return;
    const compactPage = Math.max(1, Number(searchParams.get('page')) || 1);
    if (compactPage !== ordersPage) setOrdersPage(compactPage);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab !== 'inquiries') return;
    const compactPage = Math.max(1, Number(searchParams.get('page')) || 1);
    if (compactPage !== inquiriesPage) setInquiriesPage(compactPage);

    const raw = String(searchParams.get('status') || '').toUpperCase();
    const status = INQUIRY_STATUSES.includes(raw) ? raw : 'PENDING';
    if (status !== inquiriesStatus) setInquiriesStatus(status);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab !== 'products') return;
    const next = new URLSearchParams();
    next.set('tab', TAB_QUERY.products);
    next.set('page', String(page));
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [page, activeTab]);

  useEffect(() => {
    if (activeTab !== 'orders') return;
    const next = new URLSearchParams();
    next.set('tab', TAB_QUERY.orders);
    next.set('page', String(ordersPage));
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [ordersPage, activeTab]);

  useEffect(() => {
    if (activeTab !== 'inquiries') return;
    const next = new URLSearchParams();
    next.set('tab', TAB_QUERY.inquiries);
    next.set('page', String(inquiriesPage));
    next.set('status', inquiriesStatus);
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [inquiriesPage, inquiriesStatus, activeTab]);

  const selectTab = (nextTab) => {
    setActiveTab(nextTab);
    const next = new URLSearchParams();
    next.set('tab', TAB_QUERY[nextTab] || TAB_QUERY.products);

    if (nextTab === 'products') {
      next.set('page', String(page));
    } else if (nextTab === 'orders') {
      next.set('page', String(ordersPage));
    } else if (nextTab === 'inquiries') {
      next.set('page', String(inquiriesPage));
      next.set('status', inquiriesStatus);
    }

    setSearchParams(next);
  };

  useEffect(() => {
    if (activeTab !== 'products') return;

    const fetchTable = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products', {
            params: { search, page, limit: 20, sort: `${productSort.field}_${productSort.direction}` }
        });
        setProducts(res.data.data);
        setMeta(res.data.meta);
      } catch (e) { 
        toast.error("Error al cargar productos");
      } finally { setLoading(false); }
    };
    const timer = setTimeout(() => fetchTable(), 500); 
    return () => clearTimeout(timer);
  }, [search, page, refreshTrigger, activeTab, productSort]);

  useEffect(() => {
    if (activeTab !== 'orders') return;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await api.get('/orders', {
          params: { page: ordersPage, limit: 20, search: orderSearch || undefined }
        });
        setOrders(res.data.data || []);
        setOrdersMeta(res.data.meta || { page: ordersPage, limit: 20, has_next_page: false });
      } catch (e) {
        toast.error("Error al cargar órdenes");
      } finally {
        setOrdersLoading(false);
      }
    };

    const timer = setTimeout(() => fetchOrders(), 400);
    return () => clearTimeout(timer);
  }, [activeTab, ordersPage, orderSearch, refreshTrigger]);

  const requestToggle = (product) => {
    setConfirmAction({
      type: 'toggle',
      product,
      message: `¿Deseas ${product.isActive ? 'DESHABILITAR' : 'HABILITAR'} el producto "${product.name}"?`
    });
  };

  const executeToggle = async () => {
    if (!confirmAction) return;
    const { product } = confirmAction;
    try {
        await api.put(`/products/${product.sku}`, { isActive: !product.isActive });
        setRefreshTrigger(prev => prev + 1);
        toast.success(`Producto ${product.isActive ? 'deshabilitado' : 'habilitado'}`);
    } catch(e) { 
        toast.error("Error al actualizar estado"); 
    } finally {
        setConfirmAction(null);
    }
  };

  const handleUpdate = async (formData) => {
      try {
          await api.put(`/products/${editProduct.sku}`, formData);
          setEditProduct(null);
          setRefreshTrigger(prev => prev + 1);
          toast.success("Producto actualizado");
      } catch(e) {
          toast.error("Error al guardar cambios");
      }
  };

  const quickUpdateOrder = async (order, payload) => {
    try {
      await api.patch(`/orders/${order.id}`, payload);
      setRefreshTrigger(prev => prev + 1);
      toast.success('Orden actualizada');
    } catch (e) {
      toast.error("Error al actualizar orden");
    }
  };

  const handleSortChange = (field) => {
    setPage(1);
    setProductSort((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { field, direction: 'asc' };
    });
  };

  useEffect(() => {
    setProductPageInput(String(page));
  }, [page]);

  useEffect(() => {
    setOrdersPageInput(String(ordersPage));
  }, [ordersPage]);

  const goToProductPage = () => {
    const lastPage = Math.max(1, Number(meta?.last_page) || 1);
    const parsed = Number(productPageInput);
    if (!Number.isFinite(parsed)) return;
    const target = Math.min(lastPage, Math.max(1, Math.trunc(parsed)));
    setPage(target);
  };

  const goToOrdersPage = () => {
    const parsed = Number(ordersPageInput);
    if (!Number.isFinite(parsed)) return;
    const target = Math.max(1, Math.trunc(parsed));
    setOrdersPage(target);
  };

  return (
    <div className="min-h-screen bg-[#050507] pt-24 px-4 pb-12 text-gray-200 font-sans">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-black font-cyber text-cyan-500 uppercase tracking-tighter">Panel de Control</h1>
            </div>
            <AdminStats stats={stats} dolarValue={dolarValue} />
        </div>

        <div className="flex gap-2 mb-6 border-b border-white/5 pb-px">
            <button 
                onClick={() => selectTab('products')}
                className={`flex items-center gap-2 px-6 py-3 font-cyber text-sm tracking-widest uppercase transition-all relative ${
                    activeTab === 'products' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
                }`}
            >
                <Package size={18} />
                Productos
                {activeTab === 'products' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />}
            </button>
            <button 
                onClick={() => selectTab('inquiries')}
                className={`flex items-center gap-2 px-6 py-3 font-cyber text-sm tracking-widest uppercase transition-all relative ${
                    activeTab === 'inquiries' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
                }`}
            >
                <MessageSquare size={18} />
                Consultas
                {activeTab === 'inquiries' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />}
            </button>
            <button 
                onClick={() => selectTab('orders')}
                className={`flex items-center gap-2 px-6 py-3 font-cyber text-sm tracking-widest uppercase transition-all relative ${
                    activeTab === 'orders' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
                }`}
            >
                <ReceiptText size={18} />
                Órdenes
                {activeTab === 'orders' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />}
            </button>
        </div>

        {activeTab === 'products' ? (
            <>
                <AdminToolbar search={search} setSearch={setSearch} setPage={setPage} />
                <ProductTable 
                    products={products} 
                    loading={loading} 
                    onView={setViewProduct}
                    onEdit={setEditProduct}
                    onToggle={requestToggle}
                    priceCurrency={priceCurrency}
                    setPriceCurrency={setPriceCurrency}
                    dolarValue={dolarValue}
                    productSort={productSort}
                    onSortChange={handleSortChange}
                />
                <div className="bg-[#13131a] p-4 rounded-b-2xl border border-white/5 border-t-0 flex justify-center items-center gap-4">
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p-1)} 
                        className="p-2 px-4 bg-black/30 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors cursor-pointer text-white font-mono text-xs uppercase"
                    >
                        Anterior
                    </button>
                    <span className="font-mono text-xs text-gray-400">Página <span className="text-white">{page}</span> de {meta.last_page || 1}</span>
                    <button 
                        disabled={page >= meta.last_page} 
                        onClick={() => setPage(p => p+1)} 
                        className="p-2 px-4 bg-black/30 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors cursor-pointer text-white font-mono text-xs uppercase"
                    >
                        Siguiente
                    </button>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={Math.max(1, Number(meta.last_page) || 1)}
                        value={productPageInput}
                        onChange={(e) => setProductPageInput(e.target.value)}
                        className="w-20 h-9 px-2 rounded-lg bg-black/40 border border-white/20 text-sm text-white"
                      />
                      <button
                        onClick={goToProductPage}
                        className="h-9 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase"
                      >
                        Ir
                      </button>
                    </div>
                </div>
            </>
        ) : activeTab === 'inquiries' ? (
            <InquiryTable
              page={inquiriesPage}
              onPageChange={setInquiriesPage}
              statusFilter={inquiriesStatus}
              onStatusChange={setInquiriesStatus}
            />
        ) : (
            <>
                <div className="bg-[#13131a] p-4 rounded-t-2xl border border-white/5 border-b-0">
                    <input
                      value={orderSearch}
                      onChange={(e) => {
                        setOrderSearch(e.target.value);
                        setOrdersPage(1);
                      }}
                      placeholder="Buscar por cliente, email, SKU o ID de orden..."
                      className="w-full h-11 px-4 rounded-lg bg-black/30 border border-white/10 focus:border-cyan-500/40 focus:outline-none text-sm"
                    />
                </div>
                <OrderTable 
                    orders={orders}
                    loading={ordersLoading}
                    onQuickUpdate={quickUpdateOrder}
                    onView={setViewOrder}
                />
                <div className="bg-[#13131a] p-4 rounded-b-2xl border border-white/5 border-t-0 flex justify-center items-center gap-4">
                    <button 
                        disabled={ordersPage === 1} 
                        onClick={() => setOrdersPage(p => p-1)} 
                        className="p-2 px-4 bg-black/30 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors cursor-pointer text-white font-mono text-xs uppercase"
                    >
                        Anterior
                    </button>
                    <span className="font-mono text-xs text-gray-400">Página <span className="text-white">{ordersPage}</span></span>
                    <button 
                        disabled={!ordersMeta.has_next_page} 
                        onClick={() => setOrdersPage(p => p+1)} 
                        className="p-2 px-4 bg-black/30 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors cursor-pointer text-white font-mono text-xs uppercase"
                    >
                        Siguiente
                    </button>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={ordersPageInput}
                        onChange={(e) => setOrdersPageInput(e.target.value)}
                        className="w-20 h-9 px-2 rounded-lg bg-black/40 border border-white/20 text-sm text-white"
                      />
                      <button
                        onClick={goToOrdersPage}
                        className="h-9 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase"
                      >
                        Ir
                      </button>
                    </div>
                </div>
            </>
        )}

        {viewProduct && (
          <ViewProductModal
            product={viewProduct}
            onClose={() => setViewProduct(null)}
            priceCurrency={priceCurrency}
            dolarValue={dolarValue}
          />
        )}
        {viewOrder && <ViewOrderModal order={viewOrder} onClose={() => setViewOrder(null)} />}
        {editProduct && <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} onSave={handleUpdate} />}
        {confirmAction && <ConfirmModal message={confirmAction.message} onConfirm={executeToggle} onCancel={() => setConfirmAction(null)} />}
      </div>
    </div>
  );
}


