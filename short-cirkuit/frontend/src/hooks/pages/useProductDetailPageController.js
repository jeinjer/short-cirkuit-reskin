import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../context/useAuth';
import useProductDetailData from './useProductDetailData';
import useProductInquiry from './useProductInquiry';

export default function useProductDetailPageController() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const inquiryRef = useRef(null);

  const isAdmin = user?.role === 'ADMIN';
  const isCliente = user?.role === 'CLIENTE';
  const { product, loading, requestError, images } = useProductDetailData(sku);
  const inquiryState = useProductInquiry({
    sku,
    product,
    isAuthenticated,
    isCliente,
    navigate,
    inquiryRef,
  });

  return {
    sku,
    navigate,
    selectedImage,
    setSelectedImage,
    inquiryRef,
    isAdmin,
    isCliente,
    product,
    loading,
    requestError,
    images,
    ...inquiryState,
  };
}
