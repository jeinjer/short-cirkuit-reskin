import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

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
        console.error("Error cargando dolar:", error);
        setDolarRate(1200); 
      } finally {
        setLoading(false);
      }
    };
    fetchRate();
  }, []);

  const formatPrice = (priceUsd, showArs = true) => {
    if (loading || !dolarRate) return "...";

    if (showArs) {
      const priceArs = priceUsd * dolarRate;
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
      }).format(priceArs);
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(priceUsd);
  };

  return (
    <CurrencyContext.Provider value={{ dolarRate, formatPrice, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};