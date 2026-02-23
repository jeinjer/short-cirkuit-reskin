import React from 'react';
import { useSearchParams } from 'react-router-dom';

import AdminStats from '../components/admin/AdminStats';
import InquiryTable from '../components/admin/InquiryTable';
import AdminDashboardTabs from '../components/admin/dashboard/AdminDashboardTabs';
import AdminOrdersPanel from '../components/admin/dashboard/AdminOrdersPanel';
import AdminProductsPanel from '../components/admin/dashboard/AdminProductsPanel';
import EditProductModal from '../components/admin/modals/EditProductModal';
import ViewOrderModal from '../components/admin/modals/ViewOrderModal';
import ViewProductModal from '../components/admin/modals/ViewProductModal';
import ConfirmModal from '../components/others/ConfirmModal';
import useAdminDashboardMetrics from '../hooks/admin/useAdminDashboardMetrics';
import useAdminDashboardPageState from '../hooks/admin/useAdminDashboardPageState';
import useAdminDashboardQueryState from '../hooks/admin/useAdminDashboardQueryState';
import useAdminOrdersTable from '../hooks/admin/useAdminOrdersTable';
import useAdminProductsTable from '../hooks/admin/useAdminProductsTable';
import { clampPage, parsePage } from '../utils/pagination';

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { stats, dolarValue } = useAdminDashboardMetrics();

  const {
    activeTab,
    selectTab,
    page,
    setPage,
    ordersPage,
    setOrdersPage,
    inquiriesPage,
    setInquiriesPage,
    inquiriesStatus,
    setInquiriesStatus,
  } = useAdminDashboardQueryState({
    searchParams,
    setSearchParams,
  });

  const dashboardState = useAdminDashboardPageState({ page, ordersPage });

  const {
    products,
    meta,
    loading: productsLoading,
    setLoading: setProductsLoading,
  } = useAdminProductsTable({
    activeTab,
    search: dashboardState.search,
    page,
    refreshTrigger: dashboardState.refreshTrigger,
    productSort: dashboardState.productSort,
    inStockOnly: dashboardState.inStockOnly,
    missingImageOnly: dashboardState.missingImageOnly,
  });

  const {
    orders,
    ordersMeta,
    ordersLoading,
    setOrdersLoading,
  } = useAdminOrdersTable({
    activeTab,
    ordersPage,
    orderSearch: dashboardState.orderSearch,
    refreshTrigger: dashboardState.refreshTrigger,
  });

  const handleSelectTab = (nextTab) => {
    if (nextTab === 'products') setProductsLoading(true);
    if (nextTab === 'orders') setOrdersLoading(true);
    selectTab(nextTab);
  };

  const handleSortChange = (field) => {
    setPage(1);
    dashboardState.setProductSort((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }

      return { field, direction: 'asc' };
    });
  };

  const goToProductPage = () => {
    setPage(clampPage(dashboardState.productPageInput, meta?.last_page));
  };

  const goToOrdersPage = () => {
    setOrdersPage(parsePage(dashboardState.ordersPageInput, ordersPage));
  };

  return (
    <div className="min-h-screen bg-[#050507] pt-20 md:pt-24 px-4 pb-10 md:pb-12 text-gray-200 font-sans overflow-x-clip">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black font-cyber text-cyan-500 uppercase tracking-tighter">
              Panel de Control
            </h1>
          </div>
          <AdminStats stats={stats} dolarValue={dolarValue} />
        </div>

        <AdminDashboardTabs activeTab={activeTab} onSelectTab={handleSelectTab} />

        {activeTab === 'products' ? (
          <AdminProductsPanel
            search={dashboardState.search}
            setSearch={dashboardState.setSearch}
            setPage={setPage}
            inStockOnly={dashboardState.inStockOnly}
            setInStockOnly={dashboardState.setInStockOnly}
            missingImageOnly={dashboardState.missingImageOnly}
            setMissingImageOnly={dashboardState.setMissingImageOnly}
            products={products}
            loading={productsLoading}
            onView={dashboardState.setViewProduct}
            onEdit={dashboardState.setEditProduct}
            onToggle={dashboardState.requestToggle}
            priceCurrency={dashboardState.priceCurrency}
            setPriceCurrency={dashboardState.setPriceCurrency}
            dolarValue={dolarValue}
            productSort={dashboardState.productSort}
            onSortChange={handleSortChange}
            page={page}
            meta={meta}
            productPageInput={dashboardState.productPageInput}
            setProductPageInput={dashboardState.setProductPageInput}
            onGoToProductPage={goToProductPage}
          />
        ) : activeTab === 'inquiries' ? (
          <InquiryTable
            page={inquiriesPage}
            onPageChange={setInquiriesPage}
            statusFilter={inquiriesStatus}
            onStatusChange={setInquiriesStatus}
          />
        ) : (
          <AdminOrdersPanel
            orderSearch={dashboardState.orderSearch}
            setOrderSearch={dashboardState.setOrderSearch}
            setOrdersPage={setOrdersPage}
            orders={orders}
            ordersLoading={ordersLoading}
            onQuickUpdate={dashboardState.quickUpdateOrder}
            onView={dashboardState.setViewOrder}
            ordersPage={ordersPage}
            ordersMeta={ordersMeta}
            ordersPageInput={dashboardState.ordersPageInput}
            setOrdersPageInput={dashboardState.setOrdersPageInput}
            onGoToOrdersPage={goToOrdersPage}
          />
        )}

        {dashboardState.viewProduct && (
          <ViewProductModal
            product={dashboardState.viewProduct}
            onClose={() => dashboardState.setViewProduct(null)}
            priceCurrency={dashboardState.priceCurrency}
            dolarValue={dolarValue}
          />
        )}

        {dashboardState.viewOrder && (
          <ViewOrderModal
            order={dashboardState.viewOrder}
            onClose={() => dashboardState.setViewOrder(null)}
          />
        )}

        {dashboardState.editProduct && (
          <EditProductModal
            product={dashboardState.editProduct}
            onClose={() => dashboardState.setEditProduct(null)}
            onSave={dashboardState.handleUpdate}
          />
        )}

        {dashboardState.confirmAction && (
          <ConfirmModal
            message={dashboardState.confirmAction.message}
            onConfirm={dashboardState.executeToggle}
            onCancel={() => dashboardState.setConfirmAction(null)}
          />
        )}
      </div>
    </div>
  );
}
