import { useEffect, useState } from 'react';
import { formatArs, formatUsd } from '../utils/formatters';
import { CurrencyContext } from './currencyContext.base';

const API_URL = import.meta.env.VITE_API_URL;

export const CurrencyProvider = ({ children }) => {
  const [dolarRate, setDolarRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(`${API_URL}/dolar`);
        const data = await res.json();
        setDolarRate(data.rate);
      } catch (error) {
        console.error('Error cargando dolar:', error);
        setDolarRate(1200);
      } finally {
        setLoading(false);
      }
    };
    fetchRate();
  }, []);

  const formatPrice = (priceUsd, showArs = true) => {
    if (loading || !dolarRate) return '...';

    if (showArs) {
      return formatArs(priceUsd * dolarRate);
    }

    return formatUsd(priceUsd);
  };

  return (
    <CurrencyContext.Provider value={{ dolarRate, formatPrice, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};
