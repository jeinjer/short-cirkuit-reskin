import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../api/axios';
import { getApiErrorMessage } from '../utils/apiErrors';
import { CartContext } from './cartContext.base';
import { useAuth } from './useAuth';

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ totalItems: 0, totalUsd: 0, totalArs: 0 });
  const [loading, setLoading] = useState(false);

  const isClient = user?.role === 'CLIENTE';

  const syncCart = useCallback((payload) => {
    setItems(payload?.data || []);
    setSummary(payload?.summary || { totalItems: 0, totalUsd: 0, totalArs: 0 });
  }, []);

  const clearLocalCart = useCallback(() => {
    setItems([]);
    setSummary({ totalItems: 0, totalUsd: 0, totalArs: 0 });
  }, []);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isClient) {
      clearLocalCart();
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/cart');
      syncCart(res.data);
    } catch {
      clearLocalCart();
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isClient, clearLocalCart, syncCart]);

  useEffect(() => {
    if (!authLoading) fetchCart();
  }, [authLoading, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Tenés que iniciar sesión para comprar');
      return false;
    }
    try {
      const res = await api.post('/cart/items', { productId, quantity });
      syncCart(res.data);
      toast.success('Producto agregado al carrito');
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo agregar al carrito'));
      return false;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const res = await api.patch(`/cart/items/${productId}`, { quantity });
      syncCart(res.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo actualizar el carrito'));
    }
  };

  const removeCartItem = async (productId) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`);
      syncCart(res.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo quitar el producto'));
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart');
      syncCart(res.data);
    } catch {
      toast.error('No se pudo vaciar el carrito');
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
