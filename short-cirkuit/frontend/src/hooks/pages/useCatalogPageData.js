import { useEffect, useState } from 'react';
import { fetchDynamicFilters, fetchProducts } from '../../api/config';

export default function useCatalogPageData({
  searchParams,
  category,
  search,
  selectedBrand,
  isAuthenticated
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [filtersData, setFiltersData] = useState({ brands: [] });
  const [meta, setMeta] = useState({ page: 1, last_page: 1, total: 0 });

  useEffect(() => {
    const loadFilters = async () => {
      setFiltersLoading(true);
      try {
        const data = await fetchDynamicFilters({ category, search, brand: selectedBrand });
        if (data) {
          setFiltersData((prev) => ({ ...prev, brands: data.brands || [] }));
        }
      } catch (error) {
        console.error('Error loading filters:', error);
      } finally {
        setFiltersLoading(false);
      }
    };

    loadFilters();
  }, [category, search, selectedBrand]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries([...searchParams]);
        params.limit = 12;
        const res = await fetchProducts(params);
        setProducts(res.data || []);
        setMeta(res.meta || { page: 1, last_page: 1, total: 0 });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchParams, isAuthenticated]);

  return { products, loading, filtersLoading, filtersData, meta };
}
