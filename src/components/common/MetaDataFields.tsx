import React from 'react';
import { Product } from '../../interfaces/types';
import TextField from '@mui/material/TextField';

interface MetaDataFieldsProps {
  product: Product | null;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

const MetaDataFields: React.FC<MetaDataFieldsProps> = ({ product, setProduct }) => {
  return (
    <>
      <TextField
        label="Meta Title"
        multiline
        fullWidth
        rows={3}
        value={product?.metaTitle || ''}
        onChange={(e) => setProduct(prev => ({ ...prev!, metaTitle: e.target.value }))}
      />
      <TextField
        label="Meta Description"
        multiline
        fullWidth
        rows={6}
        value={product?.metaDescription || ''}
        onChange={(e) => setProduct(prev => ({ ...prev!, metaDescription: e.target.value }))}
      />
      <TextField
        label="Keywords"
        multiline
        fullWidth
        rows={6}
        value={product?.keywords || ''}
        onChange={(e) => setProduct(prev => ({ ...prev!, keywords: e.target.value }))}
      />
    </>
  );
};

export default MetaDataFields;
