import React from 'react';
import OrderTable from '../OrderTable';
import PaginationBar from '../../common/PaginationBar';

export default function AdminOrdersPanel({
  orderSearch,
  setOrderSearch,
  setOrdersPage,
  orders,
  ordersLoading,
  onQuickUpdate,
  onView,
  ordersPage,
  ordersMeta,
  ordersPageInput,
  setOrdersPageInput,
  onGoToOrdersPage
}) {
  return (
    <>
      <div className="bg-[#13131a] p-4 rounded-t-2xl border border-white/5 border-b-0">
        <input
          value={orderSearch}
          onChange={(e) => {
            setOrderSearch(e.target.value);
            setOrdersPage(1);
          }}
          placeholder="Buscar por cliente, email, SKU o ID de orden..."
          className="w-full h-11 px-4 rounded-lg bg-black/30 border border-white/10 focus:border-cyan-500/40 focus:outline-none text-sm"
        />
      </div>

      <OrderTable
        orders={orders}
        loading={ordersLoading}
        onQuickUpdate={onQuickUpdate}
        onView={onView}
      />

      <div className="bg-[#13131a] p-4 rounded-b-2xl border border-white/5 border-t-0">
        <PaginationBar
          page={ordersPage}
          canPrev={ordersPage > 1}
          canNext={!!ordersMeta?.has_next_page}
          onPrev={() => setOrdersPage((p) => p - 1)}
          onNext={() => setOrdersPage((p) => p + 1)}
          pageInput={ordersPageInput}
          onPageInputChange={setOrdersPageInput}
          onGo={onGoToOrdersPage}
          showTotal={false}
        />
      </div>
    </>
  );
}
