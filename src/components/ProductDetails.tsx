import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TextField from '@mui/material/TextField';
import { Grid, Button, Typography, FormControlLabel, Box, Checkbox, FormGroup, FormControl, FormLabel, FormHelperText } from '@mui/material';
import { Product } from '../interfaces/types';
import useFetchProduct from '../hooks/useFetchProduct';
import useFetchRelatedProducts from '../hooks/useFetchRelatedProducts';
import useUpdateProduct from '../hooks/useUpdateProduct';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const { product: productData, loading: productLoading, error: productError } = useFetchProduct(id || '');
  const { relatedProducts, loading: relatedProductsLoading, error: relatedProductsError } = useFetchRelatedProducts(productData?.name || '');

  useEffect(() => {
    if (productError) {
      setError(productError);
    } else {
      setProduct(productData);
    }
  }, [productData, productError]);

  useEffect(() => {
    if (relatedProductsError) {
      setError(relatedProductsError);
    }
  }, [relatedProductsError]);

  const { updateProduct, loading: updateLoading, error: updateError, success: updateSuccess } = useUpdateProduct();

  const getFormData = () => {
    const id = product?.id || '';
    const description = product?.description || '';
    const metaDescription = product?.metaDescription || '';
    const metaTitle = product?.metaTitle || '';
    const keywords = product?.keywords || '';
    const shortText = product?.shortText || '';

    return {
      id,
      description,
      metaDescription,
      metaTitle,
      keywords, 
      shortText
    };
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!product) {
      return;
    }
    const formData = getFormData();
    console.log('Form Data:', formData);
    console.log('Selected Related Products:', selectedRelatedProducts);
    try {
      setError(null);
      await updateProduct(formData, selectedRelatedProducts);
      console.log('Update successful');
    } catch (err: any) {
      console.error('Error during update:', err);
      setError(err.message || 'Unknown error');
    }
  };

  const handleAdoptContent = () => {
    const productWithDescription = relatedProducts.find((p) => p.description);
    console.log(productWithDescription);
    if (productWithDescription) {
      setProduct((prevProduct) => {
        if (!prevProduct) {
          return null;
        }
        return {
          ...prevProduct,
          description: productWithDescription.description,
          metaDescription: productWithDescription.metaDescription,
          metaTitle: productWithDescription.metaTitle,
          keywords: productWithDescription.keywords,
          shortText: productWithDescription.shortText,
        };
      });
    }
  };

  const hasContent = relatedProducts.some((p) => p.description);

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setSelectAll(checked);
    if (checked) {
      setSelectedRelatedProducts(relatedProducts.map((product) => product.id));
    } else {
      setSelectedRelatedProducts([]);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: productId, checked } = event.target;
    console.log(productId, checked);
    if (checked) {
      setSelectedRelatedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedRelatedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
    }
  };

  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (productLoading || relatedProductsLoading || updateLoading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {product?.name}
      </Typography>
      {updateError && <Typography color="error">Error: {updateError}</Typography>}
      {updateSuccess && <Typography color="success">Update Successful!</Typography>}
      <form onSubmit={handleSave}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Short Text"
              multiline
              fullWidth
              rows={4}
              value={product?.shortText || ''}
            />
            <Box mt={2}>
              <Typography variant="h6">Description:</Typography>
              {product?.description !== null && (
                <CKEditor
                  editor={ClassicEditor}
                  data={product?.description || ''}
                  onReady={(editor) => {
                    //console.log('Editor is ready to use!', editor);
                  }}
                  onError={(error) => {
                    console.error('Editor error occurred:', error);
                  }}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Meta Description"
              multiline
              fullWidth
              rows={6}
              value={product?.metaDescription}
            />
            <TextField
              label="Meta Title"
              multiline
              fullWidth
              rows={3}
              value={product?.metaTitle}
            />
            <TextField
              label="Keywords"
              multiline
              fullWidth
              rows={6}
              value={product?.keywords}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Related Products</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  }
                  label="Select All"
                />
                {relatedProducts.map((relatedProduct) => (
                  <Box key={relatedProduct.id} mb={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          key={relatedProduct.id}
                          checked={product && selectedRelatedProducts.includes(relatedProduct.id) || false}
                          onChange={handleCheckboxChange}
                          value={relatedProduct.id}
                        />
                      }
                      label={`${relatedProduct.name}`}
                    />
                  </Box>
                ))}
              </FormGroup>
              <FormHelperText>Select related products</FormHelperText>
              {hasContent && (
                <Box mt={2}>
                  <Typography variant="body1">Es sind bereits Inhalte vorhanden.</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAdoptContent}
                  >
                    Inhalte übernehmen
                  </Button>
                </Box>
              )}
            </FormControl>
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave}>
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default ProductDetails;
