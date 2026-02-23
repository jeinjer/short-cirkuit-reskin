import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../../api/axios';

export default function useAdminProductsTable({
  activeTab,
  search,
  page,
  refreshTrigger,
  productSort,
  inStockOnly,
  missingImageOnly
}) {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab !== 'products') return;

    const fetchTable = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products', {
          params: {
            search,
            page,
            limit: 20,
            sort: `${productSort.field}_${productSort.direction}`,
            inStockOnly: inStockOnly ? 1 : undefined,
            missingImageOnly: missingImageOnly ? 1 : undefined
          }
        });
        setProducts(res.data.data);
        setMeta(res.data.meta);
      } catch {
        toast.error('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchTable, 500);
    return () => clearTimeout(timer);
  }, [search, page, refreshTrigger, activeTab, productSort, inStockOnly, missingImageOnly]);

  return { products, meta, loading, setLoading };
}
