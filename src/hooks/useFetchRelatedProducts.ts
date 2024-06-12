import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Product } from '../interfaces/types';

const useFetchRelatedProducts = (productName: string) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productName) {
    const fetchRelatedProducts = async () => {
      try {
        const response = await axiosInstance.post('/relatedproducts', { productName });
        setRelatedProducts(response.data.relatedProducts);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (productName) {
      fetchRelatedProducts();
    } else {
      setError('No product name provided');
      setLoading(false);
    }
  }
  }, [productName]);

  return { relatedProducts, loading, error };
};

export default useFetchRelatedProducts;
