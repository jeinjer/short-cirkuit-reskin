import { useCallback } from 'react';
import { parsePage } from '../../utils/pagination';
import {
  INQUIRY_STATUSES,
  QUERY_TAB,
  TAB_QUERY
} from '../../components/admin/dashboard/adminDashboard.constants';

const getSafeInquiryStatus = (value) => {
  const raw = String(value || '').toUpperCase();
  return INQUIRY_STATUSES.includes(raw) ? raw : 'PENDING';
};

export default function useAdminDashboardQueryState({ searchParams, setSearchParams }) {
  const activeTab = QUERY_TAB[searchParams.get('tab')] || 'products';
  const page = parsePage(searchParams.get('page'));
  const ordersPage = parsePage(searchParams.get('page'));
  const inquiriesPage = parsePage(searchParams.get('page'));
  const inquiriesStatus = getSafeInquiryStatus(searchParams.get('status'));

  const updateParams = useCallback((mutator, { replace = false } = {}) => {
    const next = new URLSearchParams(searchParams);
    mutator(next);
    setSearchParams(next, replace ? { replace: true } : undefined);
  }, [searchParams, setSearchParams]);

  const ensureTab = useCallback((next, tabKey) => {
    next.set('tab', TAB_QUERY[tabKey] || TAB_QUERY.products);
  }, []);

  const selectTab = useCallback((nextTab) => {
    if (nextTab === activeTab) return;

    const next = new URLSearchParams();
    ensureTab(next, nextTab);

    if (nextTab === 'products') {
      next.set('page', String(page));
    } else if (nextTab === 'orders') {
      next.set('page', String(ordersPage));
    } else if (nextTab === 'inquiries') {
      next.set('page', String(inquiriesPage));
      next.set('status', inquiriesStatus);
    }

    setSearchParams(next);
  }, [activeTab, ensureTab, page, ordersPage, inquiriesPage, inquiriesStatus, setSearchParams]);

  const setPage = useCallback((valueOrUpdater) => {
    const nextValue = typeof valueOrUpdater === 'function' ? valueOrUpdater(page) : valueOrUpdater;
    const parsed = parsePage(nextValue, page);
    updateParams((next) => {
      ensureTab(next, 'products');
      next.set('page', String(parsed));
    });
  }, [page, updateParams, ensureTab]);

  const setOrdersPage = useCallback((valueOrUpdater) => {
    const nextValue = typeof valueOrUpdater === 'function' ? valueOrUpdater(ordersPage) : valueOrUpdater;
    const parsed = parsePage(nextValue, ordersPage);
    updateParams((next) => {
      ensureTab(next, 'orders');
      next.set('page', String(parsed));
    });
  }, [ordersPage, updateParams, ensureTab]);

  const setInquiriesPage = useCallback((valueOrUpdater) => {
    const nextValue =
      typeof valueOrUpdater === 'function' ? valueOrUpdater(inquiriesPage) : valueOrUpdater;
    const parsed = parsePage(nextValue, inquiriesPage);
    updateParams((next) => {
      ensureTab(next, 'inquiries');
      next.set('page', String(parsed));
      next.set('status', inquiriesStatus);
    });
  }, [inquiriesPage, inquiriesStatus, updateParams, ensureTab]);

  const setInquiriesStatus = useCallback((valueOrUpdater) => {
    const nextValue =
      typeof valueOrUpdater === 'function' ? valueOrUpdater(inquiriesStatus) : valueOrUpdater;
    const parsed = getSafeInquiryStatus(nextValue);
    updateParams((next) => {
      ensureTab(next, 'inquiries');
      next.set('page', String(inquiriesPage));
      next.set('status', parsed);
    });
  }, [inquiriesStatus, inquiriesPage, updateParams, ensureTab]);

  return {
    activeTab,
    selectTab,
    page,
    setPage,
    ordersPage,
    setOrdersPage,
    inquiriesPage,
    setInquiriesPage,
    inquiriesStatus,
    setInquiriesStatus
  };
}
