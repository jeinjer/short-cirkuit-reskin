import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../../api/axios';

const DEFAULT_META = { total: 0, page: 1, last_page: 1 };

export default function useProfileOrders({ isAdmin }) {
  const [orders, setOrders] = useState([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersMeta, setOrdersMeta] = useState(DEFAULT_META);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const loadOrders = useCallback(async (page = ordersPage) => {
    try {
      setLoadingOrders(true);
      const ordersRes = await api.get('/checkout/orders/my', {
        params: { page, limit: 5 }
      });
      setOrders(ordersRes.data?.data || []);
      setOrdersMeta(ordersRes.data?.meta || { ...DEFAULT_META, page });
    } catch {
      toast.error('No se pudo cargar tus pedidos');
    } finally {
      setLoadingOrders(false);
    }
  }, [ordersPage]);

  useEffect(() => {
    if (isAdmin) return;
    loadOrders(ordersPage);
  }, [ordersPage, isAdmin, loadOrders]);

  const copyOrderId = useCallback(async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success('Numero de pedido copiado');
    } catch {
      toast.error('No se pudo copiar');
    }
  }, []);

  return {
    orders,
    ordersPage,
    setOrdersPage,
    ordersMeta,
    loadingOrders,
    loadOrders,
    copyOrderId,
    expandedOrderId,
    setExpandedOrderId
  };
}
