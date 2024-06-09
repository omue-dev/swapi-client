import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

interface Product {
  id: string;
  productNumber: string;
  name: string;
  stock: number;
  updatedAt: string;
}

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  productName: string;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ open, onClose, productName }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (open) {
      const fetchProducts = async () => {
        try {
          const response = await axios.post('/api/search/product-by-name', { name: productName });
          setProducts(response.data);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [open, productName]);

  const columns: GridColDef[] = [
    { field: 'productNumber', headerName: 'Product Number', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'stock', headerName: 'Stock', width: 100 },
    { field: 'updatedAt', headerName: 'Updated At', width: 200 },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Similar Products: {productName}</DialogTitle>
      <DialogContent>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography>Error: {error.message}</Typography>}
        {!loading && !error && (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={products} columns={columns} getRowId={(row) => row.id} />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;
