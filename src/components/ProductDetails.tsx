import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TextField from '@mui/material/TextField';
import { Grid, Button, Typography, Paper, Box, Checkbox, FormControlLabel, FormGroup, FormControl, FormLabel, FormHelperText, Autocomplete } from '@mui/material';
import { Product } from '../interfaces/types';
import useFetchProduct from '../hooks/useFetchProduct';
import useFetchRelatedProducts from '../hooks/useFetchRelatedProducts';
import useUpdateProduct from '../hooks/useUpdateProduct';
import axiosInstance from '../utils/axiosInstance';
import './ProductDetails.css';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string, name: string } | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<{ id: string, name: string }[]>([]);

  const { product: productData, loading: productLoading, error: productError } = useFetchProduct(id || '');
  const { relatedProducts, loading: relatedProductsLoading, error: relatedProductsError } = useFetchRelatedProducts(productData?.name || '');

  useEffect(() => {
    if (productError) {
      setError(productError);
    } else {
      setProduct(productData);
      //console.log('Product Data:', productData);
      if (productData && productData.categoryIds) {
        const categoriesToSet = productData.categoryIds.map((id: string) => categories.find(category => category.id === id)).filter(category => category !== undefined) as { id: string, name: string }[];
        setSelectedCategories(categoriesToSet);
      }
    }
  }, [productData, productError, categories]);

  useEffect(() => {
    if (relatedProductsError) {
      setError(relatedProductsError);
    }
  }, [relatedProductsError]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.post('/categories');
        console.log('Categories:', response.data);
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const { updateProduct, loading: updateLoading, error: updateError, success: updateSuccess } = useUpdateProduct();

  const getFormData = () => {
    const id = product?.id || '';
    const description = product?.description || '';
    const metaDescription = product?.metaDescription || '';
    const metaTitle = product?.metaTitle || '';
    const keywords = product?.keywords || '';
    const shortText = product?.shortText || '';
    const categoryIds = selectedCategories.map(category => category.id);

    return {
      id,
      description,
      metaDescription,
      metaTitle,
      keywords,
      categoryIds,
      customFields: {
        custom_add_product_attributes_short_text: shortText
      },
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

      const categoryIds = productWithDescription.categoryIds;
      const selected = categories.filter(category => categoryIds.includes(category.id));
      setSelectedCategories(prevSelectedCategories => [...prevSelectedCategories, ...selected]);    }
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
    if (checked) {
      setSelectedRelatedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedRelatedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
    }
  };

  const handleCategoryChange = (event: any, newValue: any) => {
    if (newValue && !selectedCategories.some(category => category.id === newValue.id)) {
      setSelectedCategories([...selectedCategories, newValue]);
    }
    setSelectedCategory(newValue);
  };

  const handleDeleteCategory = (id: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.filter((category) => category.id !== id)
    );
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
              onChange={(e) => setProduct(prev => ({ ...prev!, shortText: e.target.value }))}
            />
            <Box mt={2}>
              <Typography variant="h6">Description:</Typography>
              {product?.description !== null && (
                <CKEditor
                  editor={ClassicEditor}
                  data={product?.description || ''}
                  onReady={(editor) => {}}
                  onError={(error) => {
                    console.error('Editor error occurred:', error);
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setProduct(prev => ({ ...prev!, description: data }));
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
              onChange={(e) => setProduct(prev => ({ ...prev!, metaDescription: e.target.value }))}
            />
            <TextField
              label="Meta Title"
              multiline
              fullWidth
              rows={3}
              value={product?.metaTitle}
              onChange={(e) => setProduct(prev => ({ ...prev!, metaTitle: e.target.value }))}
            />
            <TextField
              label="Keywords"
              multiline
              fullWidth
              rows={6}
              value={product?.keywords}
              onChange={(e) => setProduct(prev => ({ ...prev!, keywords: e.target.value }))}
            />
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              onChange={handleCategoryChange}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select Category" variant="outlined" fullWidth />
              )}
            />
            {selectedCategories.length > 0 && (
              <Box mt={2}>
                <FormHelperText>Selected Categories:</FormHelperText>
                {selectedCategories.map((category) => (
                  <Paper 
                    key={category.id} 
                    elevation={2} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '8px', 
                      marginBottom: '8px' 
                    }}
                  >
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                      {category.name} 
                    </Typography>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            )}
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
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default ProductDetails;
