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
      if (err.response) {
          // Der Server hat geantwortet, aber der Statuscode ist nicht im Bereich von 2xx
          console.error('Error during product update:', err.response.data);
          console.error('Status code:', err.response.status);
          console.error('Headers:', err.response.headers);
          setError(`Error ${err.response.status}: ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
          // Die Anfrage wurde gesendet, aber es kam keine Antwort zurück
          console.error('Error during product update: No response received', err.request);
          setError('No response received from the server');
      } else {
          // Irgendetwas anderes verursachte den Fehler
          console.error('Error during product update:', err.message);
          setError(err.message || 'Unknown error');
      }
  } finally {
      setLoading(false);
      console.log('Update process finished');
    }
  };

  return { updateProduct, loading, error, success };
};

export default useUpdateProduct;
