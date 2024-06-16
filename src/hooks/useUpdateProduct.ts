import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateProduct = async (
    formData: any,
    selectedRelatedProducts: string[],
    onSuccess?: (updatedProduct: any) => void
  ) => {
    setLoading(true);
    try {
      setError(null);
      setSuccess(false);

      // Update the product
      const productResponse = await axiosInstance.post(`/update-product`, formData);
      const item: { success: boolean, updatedProduct: any } = productResponse.data;

      if (item.success) {
        setSuccess(true);
        if (onSuccess) onSuccess(item.updatedProduct);
      } else {
        setError('Error updating product');
      }
    } catch (err: any) {
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        setError('No response received from the server');
      } else {
        setError(err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  return { updateProduct, loading, error, success };
};

export default useUpdateProduct;
