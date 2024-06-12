import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateProduct = async (formData: any, selectedRelatedProducts: string[]) => {
    setLoading(true);
    try {
      setError(null);
      setSuccess(false);

      console.log('Sending formData:', formData);
      console.log('Selected related products:', selectedRelatedProducts);

      // Update the product
      const productResponse = await axiosInstance.post(`/update-products`, formData);
      console.log('Backend response:', productResponse.data);

      const item: { success: boolean } = productResponse.data;

      if (item.success) {
        console.log('Product updated successfully');
        setSuccess(true);
      } else {
        console.log('Error updating product');
        setError('Error updating product');
      }

      // Additional logic for selected related products if necessary
      for (const selectedId of selectedRelatedProducts) {
        console.log('SelectedID:', selectedId);
        // Logic to handle related products update
      }

    } catch (err: any) {
      console.error('Error during product update:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
      console.log('Update process finished');
    }
  };

  return { updateProduct, loading, error, success };
};

export default useUpdateProduct;
