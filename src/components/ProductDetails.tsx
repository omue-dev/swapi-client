import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Switch, Button, Modal, Box, Typography } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '../ckeditor'; // Importieren Sie Ihre CKEditor-Konfigurationsdatei

interface Product {
  id: string;
  name: string;
  active: boolean;
  description: string;
  customSearchKeywords: string;
  ean: string;
  metaDescription: string;
  metaTitle: string;
  keywords: string;
  categoryIds: string[];
  productNumber: string;
  shortText: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    console.log(`Received product ID: ${id}`);

    if (!id) {
      setError('No product ID provided');
      return;
    }

    const hex32Regex = /^[0-9a-f]{32}$/i;
    if (!hex32Regex.test(id)) {
      console.log(`Invalid Product ID format: ${id}`);
      setError('Invalid Product ID format');
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        console.log(`Fetching product with ID: ${id}`);
        const productResponse = await axiosInstance.get(`/products/${id}`);
        const item = productResponse.data;
        console.log('Product fetched successfully:', item);

        const attributes = item.data.attributes ? item.data.attributes : {};
        const customFields = attributes.customFields || {};
        const categoryIds = attributes.categoryIds || [];

        const productData = {
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
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpen();
    if (product) {
        setHtmlContent(product.description);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <form onSubmit={handleSave}>
        <div>
          <label>Active:</label>
          <Switch
            checked={product.active}
            onChange={(e) => setProduct({ ...product, active: e.target.checked })}
          />
        </div>
        <div>
          <label>Product Number:</label>
          <input
            type="text"
            value={product.productNumber}
            onChange={(e) => setProduct({ ...product, productNumber: e.target.value })}
          />
        </div>
        <div>
          <label>Description:</label>
          <CKEditor
            editor={ClassicEditor}
            data={product.description}
            onReady={(editor) => {
              console.log('Editor is ready to use!', editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setProduct({ ...product, description: data });
            }}
            onError={({  }) => {
              if (error) {
                console.warn('Editor will restart');
              } else {
                console.error('Editor error occurred');
              }
            }}
          />
        </div>
        <div>
          <label>Short Text:</label>
          <input
            type="text"
            value={product.shortText}
            onChange={(e) => setProduct({ ...product, shortText: e.target.value })}
          />
        </div>
        <div>
          <label>EAN:</label>
          <input
            type="text"
            value={product.ean}
            onChange={(e) => setProduct({ ...product, ean: e.target.value })}
          />
        </div>
        <div>
          <label>Meta Description:</label>
          <textarea
            value={product.metaDescription}
            onChange={(e) => setProduct({ ...product, metaDescription: e.target.value })}
          />
        </div>
        <div>
          <label>Meta Title:</label>
          <input
            type="text"
            value={product.metaTitle}
            onChange={(e) => setProduct({ ...product, metaTitle: e.target.value })}
          />
        </div>
        <div>
          <label>Keywords:</label>
          <input
            type="text"
            value={product.keywords}
            onChange={(e) => setProduct({ ...product, keywords: e.target.value })}
          />
        </div>
        <div>
          <label>Category IDs:</label>
          <textarea
            value={product.categoryIds.join(', ')}
            readOnly
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ maxWidth: 600, margin: 'auto', marginTop: '10%', padding: 2, backgroundColor: 'white', boxShadow: 24 }}>
          <Typography variant="h6" component="h2">
            HTML Content
          </Typography>
          <pre>{htmlContent}</pre>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ProductDetails;
