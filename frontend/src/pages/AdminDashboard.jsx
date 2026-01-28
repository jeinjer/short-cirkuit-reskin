import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner'; 
import api from '../api/axios';
import { Package, MessageSquare } from 'lucide-react';

import AdminStats from '../components/admin/AdminStats';
import AdminToolbar from '../components/admin/AdminToolbar';
import ProductTable from '../components/admin/ProductTable';
import ViewProductModal from '../components/admin/modals/ViewProductModal';
import EditProductModal from '../components/admin/modals/EditProductModal';
import InquiryTable from '../components/admin/InquiryTable';
import ConfirmModal from '../components/others/ConfirmModal'; 

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({ users: 0, products: 0 });
  const [dolarValue, setDolarValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('products'); 
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

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
    if (activeTab !== 'products') return;

    const fetchTable = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products', {
            params: { search, page, limit: 20 }
        });
        setProducts(res.data.data);
        setMeta(res.data.meta);
      } catch (e) { 
        toast.error("Error al cargar productos");
      } finally { setLoading(false); }
    };
    const timer = setTimeout(() => fetchTable(), 500); 
    return () => clearTimeout(timer);
  }, [search, page, refreshTrigger, activeTab]);

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

  return (
    <div className="min-h-screen bg-[#050507] pt-24 px-4 pb-12 text-gray-200 font-sans">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-black font-cyber text-cyan-500 uppercase tracking-tighter">Panel de Control</h1>
                <p className="text-gray-500 font-mono text-xs mt-1 uppercase tracking-widest">Administrator Access: {user?.name}</p>
            </div>
            <AdminStats stats={stats} dolarValue={dolarValue} />
        </div>

        <div className="flex gap-2 mb-6 border-b border-white/5 pb-px">
            <button 
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-6 py-3 font-cyber text-sm tracking-widest uppercase transition-all relative ${
                    activeTab === 'products' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
                }`}
            >
                <Package size={18} />
                Productos
                {activeTab === 'products' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />}
            </button>
            <button 
                onClick={() => setActiveTab('inquiries')}
                className={`flex items-center gap-2 px-6 py-3 font-cyber text-sm tracking-widest uppercase transition-all relative ${
                    activeTab === 'inquiries' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
                }`}
            >
                <MessageSquare size={18} />
                Consultas
                {activeTab === 'inquiries' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />}
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
                </div>
            </>
        ) : (
            <InquiryTable />
        )}

        {viewProduct && <ViewProductModal product={viewProduct} onClose={() => setViewProduct(null)} />}
        {editProduct && <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} onSave={handleUpdate} />}
        {confirmAction && <ConfirmModal message={confirmAction.message} onConfirm={executeToggle} onCancel={() => setConfirmAction(null)} />}
      </div>
    </div>
  );
}