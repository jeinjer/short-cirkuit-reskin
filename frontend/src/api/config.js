const API_URL = import.meta.env.VITE_API_URL;

export const fetchProducts = async (params = {}) => {
  try {
    const url = new URL(`${API_URL}/products`);
    if (typeof params === 'string') {
        if (params) url.searchParams.append('category', params);
    } else if (typeof params === 'object') {
        Object.keys(params).forEach(key => {
            if (params[key]) url.searchParams.append(key, params[key]);
        });
    }
    
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Error fetching data');
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return { data: [], meta: { total: 0, page: 1, last_page: 1 } };
  }
};

export const fetchDynamicFilters = async (params = {}) => {
    try {
        const url = new URL(`${API_URL}/filters`);
        if (params.category) url.searchParams.append('category', params.category);
        if (params.search) url.searchParams.append('search', params.search);

        const res = await fetch(url.toString());
        return await res.json();
    } catch (error) {
        return { brands: [], minPrice: 0, maxPrice: 0 };
    }
};