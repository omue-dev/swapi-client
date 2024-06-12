import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TextField from '@mui/material/TextField';
import { Grid, Button, Typography, FormControlLabel, Box, Checkbox, FormGroup, FormControl, FormLabel, FormHelperText } from '@mui/material';
import { Product } from '../interfaces/types';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  //console.log(product);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false); // State für die "Select All" Checkbox

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
          shortText: customFields.custom_add_product_attributes_short_text || '',
          stock: attributes.stock || 0 
        };

        setProduct(productData);

        // Fetch related products
        const relatedProductsResponse = await axiosInstance.post('/relatedproducts', { productName: productData.name });
        setRelatedProducts(relatedProductsResponse.data.relatedProducts);
        //console.log(relatedProductsResponse.data.relatedProducts);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        setError(error.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getFormData = () => {
    const id = product?.id || '';
    const description = product?.description || '';
    const metadescription = product?.metaDescription || '';
    const metaTitle = product?.metaTitle || '';
    const keywords = product?.keywords || '';

    return {
      id,
      description,
      metadescription,
      metaTitle,
      keywords
    };
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!product) {
      return;
    }
    const formData = getFormData();
    console.log(selectedRelatedProducts);
    // Iterieren Sie über die IDs der ausgewählten Artikel
    for (const selectedId of selectedRelatedProducts) {
      console.log("SelectedID:" + selectedId);
      // Senden Sie die Daten an das Backend
      const productResponse = await axiosInstance.post(`/update-products`, formData);
      const item: { success: boolean } = productResponse.data;

      // Überprüfen Sie die Antwort und handeln Sie entsprechend
      if (item.success) {
        // Die Daten wurden erfolgreich gespeichert
        console.log(`Die Daten für das Produkt mit der ID ${selectedId} wurden erfolgreich gespeichert`);
      } else {
        // Es gab einen Fehler beim Speichern der Daten
        console.log(`Es gab einen Fehler beim Speichern der Daten für das Produkt mit der ID ${selectedId}`);
      }
    }
  }

  const handleAdoptContent = () => {
    const productWithDescription = relatedProducts.find((p) => p.description);
    console.log(productWithDescription);
    if (productWithDescription) {
      setProduct(prevProduct => {
        if (!prevProduct) {
          return null;
        }
      
        return {
          ...prevProduct,
          description: productWithDescription.description,
          metaDescription: productWithDescription.metaDescription,
          metaTitle: productWithDescription.metaTitle,
          keywords: productWithDescription.keywords,
          shortText: productWithDescription.shortText
        };
      });  
    }
  };
  
  const hasContent = relatedProducts.some((p) => p.description);

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setSelectAll(checked);
    if (checked) {
      setSelectedRelatedProducts(relatedProducts.map((product) => product.name));
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
  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {product?.name}
      </Typography>
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
