import { useEffect, useState } from 'react';
import api from '../api/axios';
import { formatArs, formatUsd } from '../utils/formatters';
import { CurrencyContext } from './currencyContext.base';

export const CurrencyProvider = ({ children }) => {
  const [dolarRate, setDolarRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await api.get('/dolar');
        setDolarRate(res.data.rate);
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
