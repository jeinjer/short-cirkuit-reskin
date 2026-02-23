import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../../api/axios';

const DEFAULT_META = { total: 0, page: 1, last_page: 1 };

export default function useProfileInquiries({ isAdmin }) {
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesPage, setInquiriesPage] = useState(1);
  const [inquiriesMeta, setInquiriesMeta] = useState(DEFAULT_META);
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  const loadInquiries = useCallback(async (page = inquiriesPage) => {
    try {
      setLoadingInquiries(true);
      const inquiriesRes = await api.get('/inquiries/me', {
        params: { page, limit: 5 }
      });
      setInquiries(inquiriesRes.data?.data || []);
      setInquiriesMeta(inquiriesRes.data?.meta || { ...DEFAULT_META, page });
    } catch {
      toast.error('No se pudo cargar tus consultas');
    } finally {
      setLoadingInquiries(false);
    }
  }, [inquiriesPage]);

  useEffect(() => {
    if (isAdmin) return;
    loadInquiries(inquiriesPage);
  }, [inquiriesPage, isAdmin, loadInquiries]);

  return {
    inquiries,
    inquiriesPage,
    setInquiriesPage,
    inquiriesMeta,
    loadingInquiries,
    loadInquiries
  };
}
