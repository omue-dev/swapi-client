import React from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  productNumber: string;
  name: string;
  stock: number;
  updatedAt: string;
  manufacturer: string;
}

interface ProductTableProps {
  products: Product[];
  totalProducts: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  setSortModel: (model: GridSortModel) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, totalProducts, paginationModel, setPaginationModel, sortModel, setSortModel }) => {
  const navigate = useNavigate();

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', width: 300 },
    { field: 'productNumber', headerName: 'Product Number', width: 150 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <span onClick={() => handleProductClick(params.row.id)} style={{ cursor: 'pointer', color: 'blue' }}>
          {params.value}
        </span>
      )
    },
    { field: 'stock', headerName: 'Stock', width: 100 },
    { field: 'updatedAt', headerName: 'Updated At', width: 200 },
    { field: 'manufacturer', headerName: 'Manufacturer', width: 200, sortable: false }
  ];

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
  };

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  return (
    <Box style={{ height: 632, width: '100%' }}>
      <DataGrid
        rows={products}
        columns={columns}
        paginationModel={paginationModel}
        rowCount={totalProducts}
        paginationMode="server"
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[10, 25, 50]}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
      />
    </Box>
  );
};

export default ProductTable;
