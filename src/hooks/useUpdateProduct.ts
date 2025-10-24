import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { handleApiError } from '../utils/apiHelpers';

const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateProduct = async (
    formData: any,
    relatedProductsData: any[],
    onSuccess?: (updatedProduct: any) => void
  ) => {
    setLoading(true);
    try {
      setError(null);
      setSuccess(false);

      if (!relatedProductsData || relatedProductsData.length === 0) {
        // Update the main product
        const productResponse = await axiosInstance.post('/update-main-product', formData);
        const item: { success: boolean, updatedProduct: any } = productResponse.data;

        if (item.success) {
          setSuccess(true);
          if (onSuccess) onSuccess(item.updatedProduct);
        } else {
          setError('Error updating product');
        }
      } else {
        // Update related products
        const updateData = {
          'ids': relatedProductsData,
          'formData': formData
        };

        try {
          console.log('updateData:', updateData);
          await axiosInstance.post('/update-related-products', updateData);
          // ich muss zuerst die id's und dann die formData übergeben.
          setSuccess(true);
          if (onSuccess) onSuccess(formData);
        } catch (error) {
          console.error('Error updating related products:', error);
          setError('Error updating related products');
        }
      }
    } catch (err: unknown) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateProduct, loading, error, success };
};

export default useUpdateProduct;
