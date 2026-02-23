import React from 'react';
import { Toaster } from 'sonner';

import { CurrencyProvider } from '../../context/CurrencyContext';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';

const toasterOptions = {
  richColors: true,
  toastOptions: {
    style: {
      width: 'fit-content',
      minWidth: 'auto',
      paddingRight: '30px',
    },
  },
  position: 'bottom-right',
  theme: 'dark',
  closeButton: true,
};

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>{children}</CartProvider>
      </CurrencyProvider>
      <Toaster {...toasterOptions} />
    </AuthProvider>
  );
}
