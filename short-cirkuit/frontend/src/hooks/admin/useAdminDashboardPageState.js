import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import api from '../../api/axios';

export default function useAdminDashboardPageState({ page, ordersPage }) {
  const [search, setSearch] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [missingImageOnly, setMissingImageOnly] = useState(false);
  const [productPageInput, setProductPageInput] = useState('1');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [orderSearch, setOrderSearch] = useState('');
  const [ordersPageInput, setOrdersPageInput] = useState('1');

  const [viewOrder, setViewOrder] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const [priceCurrency, setPriceCurrency] = useState('ARS');
  const [productSort, setProductSort] = useState({ field: 'sale', direction: 'asc' });

  useEffect(() => {
    setProductPageInput(String(page));
  }, [page]);

  useEffect(() => {
    setOrdersPageInput(String(ordersPage));
  }, [ordersPage]);

  const bumpRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const requestToggle = (product) => {
    setConfirmAction({
      type: 'toggle',
      product,
      message: `Deseas ${product.isActive ? 'DESHABILITAR' : 'HABILITAR'} el producto "${product.name}"?`,
    });
  };

  const executeToggle = async () => {
    if (!confirmAction) return;
    const { product } = confirmAction;

    try {
      await api.put(`/products/${product.sku}`, { isActive: !product.isActive });
      bumpRefresh();
      toast.success(`Producto ${product.isActive ? 'deshabilitado' : 'habilitado'}`);
    } catch {
      toast.error('Error al actualizar estado');
    } finally {
      setConfirmAction(null);
    }
  };

  const handleUpdate = async (formData) => {
    if (!editProduct) return;

    try {
      await api.put(`/products/${editProduct.sku}`, formData);
      setEditProduct(null);
      bumpRefresh();
      toast.success('Producto actualizado');
    } catch {
      toast.error('Error al guardar cambios');
    }
  };

  const quickUpdateOrder = async (order, payload) => {
    try {
      await api.patch(`/orders/${order.id}`, payload);
      bumpRefresh();
      toast.success('Orden actualizada');
    } catch {
      toast.error('Error al actualizar orden');
    }
  };

  return {
    search,
    setSearch,
    inStockOnly,
    setInStockOnly,
    missingImageOnly,
    setMissingImageOnly,
    productPageInput,
    setProductPageInput,
    refreshTrigger,
    orderSearch,
    setOrderSearch,
    ordersPageInput,
    setOrdersPageInput,
    viewOrder,
    setViewOrder,
    viewProduct,
    setViewProduct,
    editProduct,
    setEditProduct,
    confirmAction,
    setConfirmAction,
    priceCurrency,
    setPriceCurrency,
    productSort,
    setProductSort,
    requestToggle,
    executeToggle,
    handleUpdate,
    quickUpdateOrder,
  };
}
