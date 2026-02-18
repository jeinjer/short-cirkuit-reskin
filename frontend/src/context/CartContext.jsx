import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

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
    } catch (error) {
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
      const msg = error.response?.data?.error || 'No se pudo agregar al carrito';
      toast.error(msg);
      return false;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const res = await api.patch(`/cart/items/${productId}`, { quantity });
      syncCart(res.data);
    } catch (error) {
      const msg = error.response?.data?.error || 'No se pudo actualizar el carrito';
      toast.error(msg);
    }
  };

  const removeCartItem = async (productId) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`);
      syncCart(res.data);
    } catch (error) {
      const msg = error.response?.data?.error || 'No se pudo quitar el producto';
      toast.error(msg);
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart');
      syncCart(res.data);
    } catch (error) {
      toast.error('No se pudo vaciar el carrito');
    }
  };

  const value = useMemo(() => ({
    items,
    summary,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
  }), [items, summary, loading, fetchCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
