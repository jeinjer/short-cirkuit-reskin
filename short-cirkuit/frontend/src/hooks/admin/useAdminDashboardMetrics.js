import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function useAdminDashboardMetrics() {
  const [stats, setStats] = useState({ users: 0, products: 0, sinStock: 0 });
  const [dolarValue, setDolarValue] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [statsRes, dolarRes] = await Promise.all([api.get('/stats'), api.get('/dolar')]);
        setStats(statsRes.data);
        setDolarValue(dolarRes.data.rate);
      } catch (error) {
        console.error('Error metrics', error);
      }
    };

    fetchMetrics();
  }, []);

  return { stats, dolarValue };
}
