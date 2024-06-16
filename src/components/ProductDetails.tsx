import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import ProductDescription from './common/ProductDescription';
import MetaDataFields from './common/MetaDataFields';
import RelatedProducts from './common/RelatedProducts';
import { Product, Category } from '../interfaces/types';
import useFetchProduct from '../hooks/useFetchProduct';
import useFetchRelatedProducts from '../hooks/useFetchRelatedProducts';
import useUpdateProduct from '../hooks/useUpdateProduct';
import useFetchCategories from '../hooks/useFetchCategories';
import './ProductDetails.css';
import CategorySelector from './common/CategorySelector';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const { categories } = useFetchCategories();
  const { product: productData, loading: productLoading, error: productError } = useFetchProduct(id || '');
  const { relatedProducts, loading: relatedProductsLoading, error: relatedProductsError } = useFetchRelatedProducts(productData?.name || '');
  const { updateProduct, loading: updateLoading, error: updateError, success: updateSuccess } = useUpdateProduct();

  useEffect(() => {
    if (productError) setError(productError);
    else setProduct(productData);
  }, [productData, productError]);

  useEffect(() => {
    if (productData && productData.categoryIds) {
      const categoriesToSet = productData.categoryIds
        .map((id: string) => categories.find(category => category.id === id))
        .filter(category => category !== undefined) as Category[];
      setSelectedCategories(categoriesToSet);
    }
  }, [productData, categories]);

  useEffect(() => {
    if (relatedProductsError) setError(relatedProductsError);
  }, [relatedProductsError]);

  const getFormData = () => {
    const { id = '', description = '', metaDescription = '', metaTitle = '', keywords = '', shortText = '' } = product || {};
    const categoryIds = selectedCategories.map(category => category.id);

    return {
      id,
      description,
      metaDescription,
      metaTitle,
      keywords,
      categoryIds,
      customFields: { custom_add_product_attributes_short_text: shortText },
    };
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!product) return;
    const formData = getFormData();

    try {
      setError(null);
      await updateProduct(formData, selectedRelatedProducts, () => {
        setSnackbarMessage('Update Successful!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate('/');
        }, 500);
      });
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
      setSelectedCategories(prevSelectedCategories => [
        ...prevSelectedCategories,
        ...categories.filter(category => productWithDescription.categoryIds.includes(category.id))
      ]);
    }
  }, [relatedProducts, categories]);

  const handleCategoryChange = (event: any, newValue: any) => {
    if (newValue && !selectedCategories.some(category => category.id === newValue.id)) {
      setSelectedCategories([...selectedCategories, newValue]);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setSelectedCategories(prevSelected => prevSelected.filter(category => category.id !== id));
  };

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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>{product?.name}</Typography>
      <form onSubmit={handleSave}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <ProductDescription product={product} setProduct={setProduct} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MetaDataFields product={product} setProduct={setProduct} />
            {Array.isArray(categories) && (
              <CategorySelector
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                handleCategoryChange={handleCategoryChange}
                handleDeleteCategory={handleDeleteCategory}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <RelatedProducts
              relatedProducts={relatedProducts}
              selectedRelatedProducts={selectedRelatedProducts}
              setSelectedRelatedProducts={setSelectedRelatedProducts}
              selectAll={selectAll}
              setSelectAll={setSelectAll}
              handleAdoptContent={handleAdoptContent}
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={updateLoading}>
          {updateLoading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </form>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={snackbarOpen} autoHideDuration={500} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails;
