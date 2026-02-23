import { useEffect, useState } from 'react';
import api from '../../api/axios';

const FALLBACK_IMAGE = 'https://via.placeholder.com/800x800?text=NO+IMAGE';

const getProductImages = (product) => {
  let images = [];

  if (product?.images?.length) {
    images = product.images.slice(0, 3);
  } else if (product?.imageUrl) {
    images = [product.imageUrl];
  } else {
    images = [FALLBACK_IMAGE];
  }

  return [...new Set(images)];
};

export default function useProductDetailData(sku) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!sku) return;

    const fetchProduct = async () => {
      setLoading(true);
      setRequestError(null);
      try {
        const res = await api.get(`/products/${sku}`);
        const prod = res.data;
        setProduct(prod);
        setImages(getProductImages(prod));
      } catch (error) {
        setProduct(null);
        setRequestError(error?.response?.status === 404 ? 'not_found' : 'generic');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [sku]);

  return { product, loading, requestError, images };
}
