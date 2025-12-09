const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchProducts = async (params = {}) => {
  try {
    const url = new URL(`${API_URL}/products`);
    if (typeof params === 'object') {
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
        
        if (params.brand) {
            url.searchParams.append('brand', params.brand);
        }

        if (params.minPrice) url.searchParams.append('minPrice', params.minPrice);
        if (params.maxPrice) url.searchParams.append('maxPrice', params.maxPrice);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Error fetching filters');

        const json = await res.json();
        return json;
        
    } catch (error) {
        console.error("Filter Error:", error);
        return { brands: [], minPrice: 0, maxPrice: 0 };
    }
};