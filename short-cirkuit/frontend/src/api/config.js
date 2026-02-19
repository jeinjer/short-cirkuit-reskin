import api from './axios';

export const fetchProducts = async (params = {}) => {
  try {
    const res = await api.get('/products', { params });
    return res.data;
  } catch (error) {
    console.error("API Error:", error);
    return { data: [], meta: { total: 0, page: 1, last_page: 1 } };
  }
};

export const fetchDynamicFilters = async (params = {}) => {
    try {
        const res = await api.get('/filters', { params });
        return res.data;
    } catch (error) {
        console.error("Filter Error:", error);
        return { brands: [], minPrice: 0, maxPrice: 0 };
    }
};