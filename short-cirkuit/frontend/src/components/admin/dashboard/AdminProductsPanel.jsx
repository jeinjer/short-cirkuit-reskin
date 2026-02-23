import React from 'react';
import AdminToolbar from '../AdminToolbar';
import ProductTable from '../ProductTable';
import PaginationBar from '../../common/PaginationBar';

export default function AdminProductsPanel({
  search,
  setSearch,
  setPage,
  inStockOnly,
  setInStockOnly,
  missingImageOnly,
  setMissingImageOnly,
  products,
  loading,
  onView,
  onEdit,
  onToggle,
  priceCurrency,
  setPriceCurrency,
  dolarValue,
  productSort,
  onSortChange,
  page,
  meta,
  productPageInput,
  setProductPageInput,
  onGoToProductPage
}) {
  const lastPage = Math.max(1, Number(meta?.last_page) || 1);

  return (
    <>
      <AdminToolbar
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        missingImageOnly={missingImageOnly}
        setMissingImageOnly={setMissingImageOnly}
      />

      <ProductTable
        products={products}
        loading={loading}
        onView={onView}
        onEdit={onEdit}
        onToggle={onToggle}
        priceCurrency={priceCurrency}
        setPriceCurrency={setPriceCurrency}
        dolarValue={dolarValue}
        productSort={productSort}
        onSortChange={onSortChange}
      />

      <div className="bg-[#13131a] p-4 rounded-b-2xl border border-white/5 border-t-0">
        <PaginationBar
          page={page}
          canPrev={page > 1}
          canNext={page < lastPage}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
          totalPages={lastPage}
          pageInput={productPageInput}
          onPageInputChange={setProductPageInput}
          onGo={onGoToProductPage}
          maxInputPage={lastPage}
          showTotal
        />
      </div>
    </>
  );
}
