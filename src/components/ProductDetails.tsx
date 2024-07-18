import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import ProductDescription from './common/ProductDescription';
import MetaDataFields from './common/MetaDataFields';
import RelatedProducts from './common/RelatedProducts';
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const { product: productData, loading: productLoading, error: productError } = useFetchProduct(id || '');
  const { relatedProducts, loading: relatedProductsLoading, error: relatedProductsError } = useFetchRelatedProducts(productData?.name || '');
  const { updateProduct, loading: updateLoading, error: updateError, success: updateSuccess } = useUpdateProduct();

  useEffect(() => {
    if (productError) setError(productError);
    else setProduct(productData);
  }, [productData, productError]);

  useEffect(() => {
    if (relatedProductsError) setError(relatedProductsError);
  }, [relatedProductsError]);

  const getFormData = (product: Product) => {
    const { id = '', description = '', metaDescription = '', metaTitle = '', keywords = '', shortText = '' } = product || {};

    return {
      id,
      description,
      metaDescription,
      metaTitle,
      keywords,
      customFields: { custom_add_product_attributes_short_text: shortText },
    };
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!product) return;
    const formData = getFormData(product);

    const relatedProductsData = selectedRelatedProducts;

    try {
      setError(null);
      await updateProduct(
        formData,
        relatedProductsData,
        () => {
          setSnackbarMessage('Update Successful!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        }
      );
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
  };

  const handleAdoptContent = useCallback(() => {
    const productWithDescription = relatedProducts.find(p => p.description);
    if (productWithDescription) {
      setProduct(prevProduct => {
        if (!prevProduct) return null;
        return { ...prevProduct, ...productWithDescription };
      });
    }
  }, [relatedProducts]);

  useEffect(() => {
    if (updateError) {
      setSnackbarMessage(updateError);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [updateError]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (productLoading || relatedProductsLoading) return <Typography>Loading...</Typography>;
  
  const productName = product?.name.split(',')[0] || '';

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>{product?.productNumber} - {productName}</Typography>
      <form onSubmit={handleSave}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ProductDescription product={product} setProduct={setProduct} />
          </Grid>
          <Grid item xs={12} sm={6}>
          {relatedProducts.length > 1  && (
            <RelatedProducts
              relatedProducts={relatedProducts}
              selectedRelatedProducts={selectedRelatedProducts}
              setSelectedRelatedProducts={setSelectedRelatedProducts}
              selectAll={selectAll}
              setSelectAll={setSelectAll}
              handleAdoptContent={handleAdoptContent}
            />
          )}
            <MetaDataFields product={product} setProduct={setProduct} />
          </Grid>
        </Grid>
        <Box className="sticky-save-button">
          <Button type="submit" variant="contained" color="primary" onClick={handleSave} disabled={updateLoading}>
            {updateLoading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </Box>       
      </form>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails;
