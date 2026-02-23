import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../../api/axios';

const DEFAULT_ORDERS_META = { page: 1, limit: 20, has_next_page: false };

export default function useAdminOrdersTable({
  activeTab,
  ordersPage,
  orderSearch,
  refreshTrigger
}) {
  const [orders, setOrders] = useState([]);
  const [ordersMeta, setOrdersMeta] = useState(DEFAULT_ORDERS_META);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== 'orders') return;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await api.get('/orders', {
          params: { page: ordersPage, limit: 20, search: orderSearch || undefined }
        });
        setOrders(res.data.data || []);
        setOrdersMeta(res.data.meta || { ...DEFAULT_ORDERS_META, page: ordersPage });
      } catch {
        toast.error('Error al cargar órdenes');
      } finally {
        setOrdersLoading(false);
      }
    };

    const timer = setTimeout(fetchOrders, 400);
    return () => clearTimeout(timer);
  }, [activeTab, ordersPage, orderSearch, refreshTrigger]);

  return { orders, ordersMeta, ordersLoading, setOrdersLoading };
}
