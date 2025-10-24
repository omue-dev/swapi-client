import React, { useEffect, useCallback, useState } from 'react';
import ProductTable from '../components/ProductTable';
import { Container, TextField, InputAdornment, IconButton, CircularProgress, Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { green, red } from '@mui/material/colors';
import ClearIcon from '@mui/icons-material/Clear';
import useFetchInitialProducts from '../hooks/useFetchInitialProducts';
import debounce from 'lodash.debounce';
import { UI } from '../constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';

const Home: React.FC = () => {
  const {
    products,
    totalProducts,
    loading,
    error,
    paginationModel,
    setPaginationModel,
    sortModel,
    setSortModel,
    searchTerm,
    setSearchTerm,
    setManufacturerIdFilter,
    fetchInitialProducts,
  } = useFetchInitialProducts();

  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);

  const debouncedFetchProducts = useCallback(
    debounce((searchValue: string) => {
      fetchInitialProducts(searchValue);
    }, UI.DEBOUNCE_DELAY),
    [fetchInitialProducts]
  );

  useEffect(() => {
    const storedManufacturerId = localStorage.getItem('manufacturerId');
    if (storedManufacturerId) {
      setManufacturerIdFilter(storedManufacturerId);
      setSelectedManufacturer(storedManufacturerId);
    }
  }, [setManufacturerIdFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    debouncedFetchProducts(searchValue);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchInitialProducts('');
  };

  const handleManufacturerClick = (manufacturerId: string) => {
    console.log("Manufacturer clicked:", manufacturerId); // Log the manufacturerId
    setManufacturerIdFilter(manufacturerId);
    setSelectedManufacturer(manufacturerId);
    localStorage.setItem('manufacturerId', manufacturerId);
    // No need to call fetchInitialProducts here, useEffect will handle it
  };

  const handleClearManufacturerFilter = () => {
    console.log("Clearing manufacturer filter");
    setManufacturerIdFilter(null);
    setSelectedManufacturer(null);
    localStorage.removeItem('manufacturerId');
    fetchInitialProducts(searchTerm); // Fetch products without manufacturer filter
  };

  return (
    <div>
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
       {selectedManufacturer &&
      <Box display="flex" alignItems="center" mb={2}>
        <Button onClick={handleClearManufacturerFilter} variant="outlined" color="secondary" style={{ marginRight: '10px' }}>
          Clear Manufacturer Filter
        </Button>
      </Box>
      }
      {loading ? (
        <LoadingSpinner message="Loading products..." />
      ) : error ? (
        <ErrorDisplay error={error.message} />
      ) : (
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
          renderProcessedIcon={(processed: boolean) => {
            return processed === true ? (
              <CheckCircleIcon style={{ color: green[500] }} />
            ) : (
              <CancelIcon style={{ color: red[500] }} />
            );
          }}
          onManufacturerClick={handleManufacturerClick} // Add this line
        />
      )}
    </div>
  );
};

export default Home;
