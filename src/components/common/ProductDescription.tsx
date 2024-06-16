import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { sanitizeDescription } from '../../utils/utils';
import { Product } from '../../interfaces/types';
import TextField from '@mui/material/TextField';
import { Box, Typography } from '@mui/material';

interface ProductDescriptionProps {
  product: Product | null;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product, setProduct }) => {
  return (
    <Box mt={2}>
      <Typography variant="h6">Description:</Typography>
      {product?.description !== null && (
        <CKEditor
          editor={ClassicEditor}
          data={product?.description || ''}
          onError={error => console.error('Editor error occurred:', error)}
          onChange={(_event, editor) => {
            const data = sanitizeDescription(editor.getData());
            setProduct(prev => ({ ...prev!, description: data }));
          }}
        />
      )}
      <TextField
        label="Short Text"
        multiline
        fullWidth
        rows={4}
        value={product?.shortText || ''}
        onChange={(e) => setProduct(prev => ({ ...prev!, shortText: e.target.value }))}
      />
    </Box>
  );
};

export default ProductDescription;
