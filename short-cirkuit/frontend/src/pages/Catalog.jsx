import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCurrency } from '../context/useCurrency';
import { useAuth } from '../context/useAuth';
import useCatalogPageData from '../hooks/pages/useCatalogPageData';

import CatalogSidebar from '../components/catalog/CatalogSidebar';
import CatalogHeader from '../components/catalog/CatalogHeader';
import CatalogGrid from '../components/catalog/CatalogGrid';
import CatalogPagination from '../components/catalog/CatalogPagination';

export default function Catalog() {
  const [viewMode, setViewMode] = useState('grid');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const { dolarRate } = useCurrency(); 
  const { isAuthenticated } = useAuth();

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const selectedBrand = searchParams.get('brand');
  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'price_asc';

  const { products, loading, filtersLoading, filtersData, meta } = useCatalogPageData({
    searchParams,
    category,
    search,
    selectedBrand,
    isAuthenticated
  });

  const handleSortChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePriceFilter = (min, max) => {
    if (!dolarRate) return;
    const newParams = new URLSearchParams(searchParams);
    if (min) newParams.set('minPrice', (parseFloat(min) / dolarRate).toString());
    else newParams.delete('minPrice');
    if (max) newParams.set('maxPrice', (parseFloat(max) / dolarRate).toString());
    else newParams.delete('maxPrice');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-[#050507] pt-24 md:pt-28 pb-10 md:pb-12 px-4 font-sans selection:bg-cyan-500/30 overflow-x-clip">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      <div className="container mx-auto flex flex-col lg:flex-row gap-5 md:gap-8 relative z-10">

        <CatalogSidebar 
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            filtersData={filtersData}
            filtersLoading={filtersLoading}
            onApplyPrice={handlePriceFilter}
        />

        <div className="flex-1">
            <CatalogHeader 
                category={category}
                totalResults={meta.total}
                viewMode={viewMode}
                setViewMode={setViewMode}
                sort={sort}
                onSortChange={handleSortChange}
            />

            <CatalogGrid 
                loading={loading}
                products={products}
                viewMode={viewMode}
                onClearFilters={() => setSearchParams({})}
            />
             
            <CatalogPagination 
                meta={meta}
                page={page}
                onPageChange={handlePageChange}
            />
        </div>
      </div>
    </div>
  );
}
