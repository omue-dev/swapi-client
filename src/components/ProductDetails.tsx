import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid } from '@mui/material';
import ProductDescription from './common/ProductDescription';
import MetaDataFields from './common/MetaDataFields';
import RelatedProducts from './common/RelatedProducts';
import GenderSelect from './common/GenderSelect';
import SaveButton from './common/SaveButton';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorDisplay from './common/ErrorDisplay';
import useFetchProduct from '../hooks/useFetchProduct';
import useFetchRelatedProducts from '../hooks/useFetchRelatedProducts';
import useUpdateProduct from '../hooks/useUpdateProduct';
import { useProductForm } from '../hooks/useProductForm';
import { useSnackbar } from '../hooks/useSnackbar';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { validateProduct } from '../utils/validation';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { product: productData, loading: productLoading, error: productError } = useFetchProduct(id || '');
  const { relatedProducts, loading: relatedProductsLoading, error: relatedProductsError } = useFetchRelatedProducts(productData?.name || '');
  const { updateProduct, loading: updateLoading, error: updateError } = useUpdateProduct();
  
  const {
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
  } = useProductForm(productData);

  const { showSuccess, showError } = useSnackbar();
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    if (productError) {
      handleError(productError, 'Failed to load product');
    }
  }, [productError, handleError]);

  useEffect(() => {
    if (relatedProductsError) {
      handleError(relatedProductsError, 'Failed to load related products');
    }
  }, [relatedProductsError, handleError]);

  useEffect(() => {
    if (updateError) {
      showError(updateError);
    }
  }, [updateError, showError]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!product) return;
    
    // Validate product before saving
    const validation = validateProduct(product);
    if (!validation.isValid) {
      handleError(validation.errors.join(', '), 'Validation failed');
      return;
    }
    
    const formData = getFormData(product);
    const relatedProductsData = selectedRelatedProducts;

    try {
      clearError();
      await updateProduct(
        formData,
        relatedProductsData,
        () => {
          showSuccess('Update Successful!');
        }
      );
    } catch (err: unknown) {
      handleError(err, 'Failed to update product');
    }
  };

  const handleAdoptContentFromRelated = () => {
    handleAdoptContent(relatedProducts);
  };

  if (error) return <ErrorDisplay error={error} onClose={clearError} />;
  if (productLoading || relatedProductsLoading) return <LoadingSpinner message="Loading product details..." fullHeight />;
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>{product?.productNumber} - {product?.name}</Typography>
      <form onSubmit={handleSave}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ProductDescription product={product} setProduct={setProduct} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <GenderSelect product={product} setProduct={setProduct} />
            {relatedProducts.length > 1 && (
              <RelatedProducts
                relatedProducts={relatedProducts}
                selectedRelatedProducts={selectedRelatedProducts}
                setSelectedRelatedProducts={setSelectedRelatedProducts}
                selectAll={selectAll}
                setSelectAll={setSelectAll}
                handleAdoptContent={handleAdoptContentFromRelated}
              />
            )}
            <MetaDataFields 
              product={product} 
              setProduct={setProduct}
              metaTitleColor={metaTitleColor} 
              metaDescriptionColor={metaDescriptionColor}
              metaTitleLength={metaTitleLength}
              metaDescriptionLength={metaDescriptionLength}
              handleMetaTitleChange={handleMetaTitleChange}
              handleMetaDescriptionChange={handleMetaDescriptionChange}
            />
          </Grid>
        </Grid>
        <SaveButton loading={updateLoading} onClick={handleSave} />
      </form>
    </Box>
  );
};

export default ProductDetails;
