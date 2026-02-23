import { useMemo } from 'react';

import { useAuth } from '../../context/useAuth';
import { useCart } from '../../context/useCart';
import useCheckoutFlow from './useCheckoutFlow';

export default function useCheckoutPageController() {
  const { items, summary, fetchCart, loading: cartLoading } = useCart();
  const { user } = useAuth();

  const hasItems = items.length > 0;
  const isCliente = user?.role === 'CLIENTE';
  const displayName = useMemo(() => user?.name?.split(' ')[0] || 'Cliente', [user]);

  const checkoutFlow = useCheckoutFlow({ hasItems, fetchCart });

  return {
    items,
    summary,
    cartLoading,
    user,
    hasItems,
    isCliente,
    displayName,
    ...checkoutFlow,
  };
}
