import React from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ProductTableProps } from "../interfaces/types";

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  totalProducts,
  paginationModel,
  setPaginationModel,
  sortModel,
  setSortModel,
  renderStatusIcon,
  renderProcessedIcon,
  onManufacturerClick,
}) => {
  const navigate = useNavigate();

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <span
          onClick={() => handleProductClick(params.row.id)}
          style={{ cursor: "pointer", color: "blue" }}
        >
          {params.value}
        </span>
      ),
    },
    { field: "stock", headerName: "Stock", width: 100 },
    { field: "updatedAt", headerName: "Updated At", width: 200 },
    {
      field: "manufacturer",
      headerName: "Manufacturer",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <span
          onClick={() => onManufacturerClick(params.row.manufacturerId)}
          style={{ cursor: "pointer", color: "blue" }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      sortable: false,
      renderCell: (params) => renderStatusIcon(params.value),
    },
    {
      field: "hasContent",
      headerName: "Processed",
      width: 200,
      sortable: false,
      renderCell: (params) => renderProcessedIcon(params.value),
    },
  ];

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
  };

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  return (
    <Box style={{ height: 632, width: "100%" }}>
      <DataGrid
        rows={products}
        columns={columns}
        paginationModel={paginationModel}
        rowCount={totalProducts}
        paginationMode="server"
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[10, 25, 50, 100]}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
      />
    </Box>
  );
};

export default ProductTable;
