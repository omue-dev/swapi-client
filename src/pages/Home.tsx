import React, { useEffect, useState } from "react";
import ProductTable from '../components/ProductTable';
import { Container, TextField, Typography, InputAdornment, IconButton } from "@mui/material";
import axiosInstance from '../utils/axiosInstance';
import { useManufacturers } from '../context/ManufacturerContext';
import { Manufacturer, Product } from '../interfaces/types';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { green, red } from '@mui/material/colors';
import ClearIcon from '@mui/icons-material/Clear'; // Import des ClearIcons


const Home: React.FC = () => {
  const { manufacturers, setManufacturers } = useManufacturers();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ pageSize: 10, page: 0 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'name', sort: 'asc' }]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [logMessage, setLogMessage] = useState<string>("");

  const mapResponseToManufacturers = (data: any): Manufacturer[] => {
    if (!data || !data.data) {
      console.error('Invalid data format:', data);
      return [];
    }

    return data.data
      .map((item: any) => ({
        id: item.id,
        name: item.attributes.name,
      }))
      .sort((a: Manufacturer, b: Manufacturer) => a.name.localeCompare(b.name));
  };

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await axiosInstance.post('/search/product-manufacturer');
        const manufacturersData = mapResponseToManufacturers(response.data);
        setManufacturers(manufacturersData);
      } catch (err) {
        console.error('Error fetching manufacturers:', err);
      }
    };

    fetchManufacturers();
  }, [setManufacturers]);

  const fetchProducts = async (search: string = "") => {
    setLoading(true);
    try {
      const endpoint = search ? '/search/product' : '/products';
      console.log(`Calling endpoint: ${endpoint}`); // Log-Ausgabe zum Überprüfen des Endpunkts
      const response = await axiosInstance.post(endpoint, {
        searchTerm: search,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortField: sortModel[0]?.field || 'name',
        sortDirection: sortModel[0]?.sort || 'asc',
      });
      const { products, totalProducts, log } = response.data;
      setLogMessage(log);  // Speichern der Log-Nachricht
      //console.log("Log Message:", log);  // Log-Nachricht in der Konsole ausgeben
      const productsData = products.map((item: any) => {
        const attributes = item.attributes ? item.attributes : {};
        const manufacturer = manufacturers.find(manufacturer => manufacturer.id === attributes.manufacturerId);

        return {
          id: item.id,
          productNumber: attributes.manufacturerNumber || '',
          name: attributes.name || '',
          stock: attributes.stock !== undefined ? attributes.stock : 0,
          updatedAt: attributes.updatedAt ? new Date(attributes.updatedAt).toLocaleDateString() : 'N/A',
          manufacturer: manufacturer ? manufacturer.name : 'Unknown Manufacturer',
          manufacturerId: attributes.manufacturerId || '',
          status: attributes.active ? 'Active' : 'Inactive'
        } as Product;
      });
      //console.log(productsData, totalProducts); // Log-Ausgabe zum Überprüfen der Produkte und der Gesamtanzahl
      setProducts(productsData);
      setTotalProducts(parseInt(totalProducts));
    } catch (error) {
      console.error('Error fetching products:', error instanceof Error ? error.message : 'Unknown error');
      setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchTerm);
  }, [paginationModel, sortModel, manufacturers]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    //console.log(`Search term: ${searchValue}`); // Log-Ausgabe zum Überprüfen des Suchbegriffs
    fetchProducts(searchValue);
  };
  const handleClearSearch = () => {
    setSearchTerm("");
    fetchProducts("");
  };
  return (
    <Container className='table-container'>
       <TextField
        label="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        variant="outlined"
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!loading && !error && (
        <>
          <Typography variant="body1">{logMessage}</Typography> {/* Log-Nachricht anzeigen */}
          <ProductTable
            products={products}
            totalProducts={totalProducts}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            sortModel={sortModel}
            setSortModel={setSortModel}
            renderStatusIcon={(status: string) => {
              return status === 'Active' ? (
                <CheckCircleIcon style={{ color: green[500] }} />
              ) : (
                <CancelIcon style={{ color: red[500] }} />
              );
            }}
          />
        </>
      )}
    </Container>
  );
};

export default Home;
