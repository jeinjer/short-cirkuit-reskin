import { useEffect, useState } from 'react';
import { fetchProducts } from '../../api/config';

export default function useHomeProducts({ searchTerm, selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const filters = {
          search: searchTerm,
          ...(selectedCategory && { category: selectedCategory })
        };
        const res = await fetchProducts(filters);
        setProducts(res.data || []);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchTerm, selectedCategory]);

  return { products, loading };
}
