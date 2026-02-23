import { useContext } from 'react';
import { CartContext } from './cartContext.base';

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
