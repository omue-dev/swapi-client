import { useState, useCallback, useEffect } from 'react';
import { Product } from '../interfaces/types';
import { SEO_LIMITS } from '../constants';

interface UseProductFormReturn {
  product: Product | null;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  selectedRelatedProducts: string[];
  setSelectedRelatedProducts: React.Dispatch<React.SetStateAction<string[]>>;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  metaTitleLength: number;
  metaDescriptionLength: number;
  metaTitleColor: string;
  metaDescriptionColor: string;
  handleMetaTitleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleMetaDescriptionChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  getFormData: (product: Product) => any;
  handleAdoptContent: (relatedProducts: Product[]) => void;
}

export const useProductForm = (initialProduct: Product | null = null): UseProductFormReturn => {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Synchronize local product state with initialProduct changes
  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
    }
  }, [initialProduct]);

  const metaTitleLength = product?.metaTitle?.length || 0;
  const metaDescriptionLength = product?.metaDescription?.length || 0;

  const metaTitleColor = metaTitleLength <= SEO_LIMITS.META_TITLE_MAX_LENGTH ? 'green' : 'red';
  const metaDescriptionColor = metaDescriptionLength <= SEO_LIMITS.META_DESCRIPTION_MAX_LENGTH ? 'green' : 'red';

  const handleMetaTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newMetaTitle = event.target.value;
    setProduct(prevProduct => prevProduct ? { ...prevProduct, metaTitle: newMetaTitle } : null);
  }, []);

  const handleMetaDescriptionChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newMetaDescription = event.target.value;
    setProduct(prevProduct => prevProduct ? { ...prevProduct, metaDescription: newMetaDescription } : null);
  }, []);

  const getFormData = useCallback((product: Product) => {
    const { 
      id = '', 
      description = '', 
      metaDescription = '', 
      metaTitle = '', 
      keywords = '', 
      shortText = '', 
      gender = ''
    } = product || {};

    return {
      id,
      description,
      metaDescription,
      metaTitle,
      keywords,
      customFields: {
        custom_add_product_attributes_short_text: shortText,
        custom_add_product_attributes_gender: gender,
      },
    };
  }, []);

  const handleAdoptContent = useCallback((relatedProducts: Product[]) => {
    const productWithDescription = relatedProducts.find(p => p.description);
    if (productWithDescription) {
      setProduct(prevProduct => {
        if (!prevProduct) return null;
        return { ...prevProduct, ...productWithDescription };
      });
    }
  }, []);

  return {
    product,
    setProduct,
    selectedRelatedProducts,
    setSelectedRelatedProducts,
    selectAll,
    setSelectAll,
    metaTitleLength,
    metaDescriptionLength,
    metaTitleColor,
    metaDescriptionColor,
    handleMetaTitleChange,
    handleMetaDescriptionChange,
    getFormData,
    handleAdoptContent,
  };
};
