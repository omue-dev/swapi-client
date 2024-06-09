import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import { Grid, Button, Typography, FormControlLabel, Box, Checkbox, FormGroup, FormControl, FormLabel, FormHelperText } from '@mui/material';
import { Product } from '../interfaces/types';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (!id) {
      setError('No product ID provided');
      return;
    }

    const hex32Regex = /^[0-9a-f]{32}$/i;
    if (!hex32Regex.test(id)) {
      setError('Invalid Product ID format');
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productResponse = await axiosInstance.get(`/products/${id}`);
        const item = productResponse.data;

        const attributes = item.data.attributes ? item.data.attributes : {};
        const customFields = attributes.customFields || {};
        const categoryIds = attributes.categoryIds || [];

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
          productNumber: attributes.productNumber || '',
          shortText: customFields.custom_add_product_attributes_short_text || ''
        };

        setProduct(productData);
        
        // Fetch related products
        const relatedProductsResponse = await axiosInstance.post('/relatedproducts', { productName: productData.name });
        setRelatedProducts(relatedProductsResponse.data.relatedProducts);

      } catch (error: any) {
        console.error('Error fetching product:', error);
        setError(error.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic here
  };

  const handleRelatedProductChange = (productName: string) => {
    setSelectedRelatedProducts((prevSelected) =>
      prevSelected.includes(productName)
        ? prevSelected.filter((name) => name !== productName)
        : [...prevSelected, productName]
    );
  };

  const handleAdoptContent = () => {
    const productWithDescription = relatedProducts.find((p) => p.description);
    if (productWithDescription && product) {
      setProduct({
        ...product,
        description: productWithDescription.description,
        metaDescription: productWithDescription.metaDescription,
        metaTitle: productWithDescription.metaTitle,
        keywords: productWithDescription.keywords,
        shortText: productWithDescription.shortText,
        customSearchKeywords: productWithDescription.customSearchKeywords,
        ean: productWithDescription.ean,
        productNumber: product.productNumber, // Ensure original value is retained
        id: product.id, // Ensure original value is retained
        name: product.name, // Ensure original value is retained
        active: product.active, // Ensure original value is retained
        categoryIds: product.categoryIds // Ensure original value is retained
      });
    }
  };

  const hasContent = relatedProducts.some((p) => p.description);

  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (loading) return <Typography>Loading...</Typography>;
  if (!product) return <Typography>Product not found</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {product.productNumber}: {product.name}
      </Typography>
      <form onSubmit={handleSave}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Short Text"
              multiline
              fullWidth
              rows={4}
              value={product.shortText}
              onChange={(e) => setProduct({ ...product, shortText: e.target.value })}
            />
            <Box mt={2}>
              <Typography variant="h6">Description:</Typography>
              {product.description !== null && (
                <CKEditor
                  editor={ClassicEditor}
                  data={product.description}
                  onReady={(editor) => {
                    //console.log('Editor is ready to use!', editor);
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setProduct({ ...product, description: data });
                  }}
                  onError={(error) => {
                    console.error('Editor error occurred:', error);
                  }}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={product.active}
                  onChange={(e) => setProduct({ ...product, active: e.target.checked })}
                />
              }
              label="Active"
            />
            <TextField
              label="Product Number"
              fullWidth
              value={product.productNumber}
              onChange={(e) => setProduct({ ...product, productNumber: e.target.value })}
            />
            <TextField
              label="EAN"
              fullWidth
              value={product.ean}
              onChange={(e) => setProduct({ ...product, ean: e.target.value })}
            />
            <TextField
              label="Meta Description"
              multiline
              fullWidth
              rows={3}
              value={product.metaDescription}
              onChange={(e) => setProduct({ ...product, metaDescription: e.target.value })}
            />
            <TextField
              label="Meta Title"
              fullWidth
              value={product.metaTitle}
              onChange={(e) => setProduct({ ...product, metaTitle: e.target.value })}
            />
            <TextField
              label="Keywords"
              fullWidth
              value={product.keywords}
              onChange={(e) => setProduct({ ...product, keywords: e.target.value })}
            />
            <TextField
              label="Category IDs"
              multiline
              fullWidth
              rows={3}
              value={product.categoryIds.join(', ')}
              onChange={(e) => console.log(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Related Products</FormLabel>
              <FormGroup>
                {relatedProducts.map((relatedProduct) => (
                  <Box key={relatedProduct.id} mb={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedRelatedProducts.includes(relatedProduct.name)}
                          onChange={() => handleRelatedProductChange(relatedProduct.name)}
                          name={relatedProduct.name}
                        />
                      }
                      label={`${relatedProduct.productNumber}: ${relatedProduct.name}`}
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
