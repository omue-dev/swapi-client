// useFetchProduct.ts
import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Product } from '../interfaces/types';

const useFetchProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/single-product/${id}`);
        const item = response.data.product; // Anpassung hier, um das Produkt korrekt zu extrahieren
        const attributes = item.data.attributes || {};
        const customFields = attributes.customFields || {};
        const gender = item.gender || attributes.gender || '';
        const categoryIds = attributes.categoryIds || [];
        console.log(attributes);

        const productData: Product = {
          id: item.data.id,
          name: attributes.name || '',
          active: attributes.active || false,
          description: attributes.description || '',
          customSearchKeywords: attributes.customSearchKeywords || '',
          ean: attributes.ean || '',
          metaDescription: attributes.metaDescription || '',
          metaTitle: attributes.metaTitle || '',
          keywords: attributes.keywords || '',
          categoryIds: categoryIds,
          productNumber: customFields.custom_add_product_attributes_oomodellcode || '',
          shortText: customFields.custom_add_product_attributes_short_text || '',
          stock: attributes.stock || 0,
          gender,
          status: '',
          hasContent: false,
        };

        setProduct(productData);
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

    if (id) {
      fetchProduct();
    } else {
      setError('No product ID provided');
      setLoading(false);
    }
  }, [id]);

  return { product, loading, error };
};

export default useFetchProduct;
