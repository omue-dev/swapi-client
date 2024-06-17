import React, { useEffect, useCallback } from 'react';
import ProductTable from '../components/ProductTable';
import { Container, TextField, Typography, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { green, red } from '@mui/material/colors';
import ClearIcon from '@mui/icons-material/Clear';
import useFetchInitialProducts from '../hooks/useFetchInitialProducts';
import debounce from 'lodash.debounce';

const Home: React.FC = () => {
  const {
    products,
    totalProducts,
    loading,
    error,
    logMessage,
    paginationModel,
    setPaginationModel,
    sortModel,
    setSortModel,
    searchTerm,
    setSearchTerm,
    fetchInitialProducts,
  } = useFetchInitialProducts();

  const debouncedFetchProducts = useCallback(
    debounce((searchValue: string) => {
      fetchInitialProducts(searchValue);
    }, 300),
    [fetchInitialProducts]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    debouncedFetchProducts(searchValue);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchInitialProducts('');
  };

  return (
    <Container className="table-container">
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
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <>
          <Typography variant="body1">{logMessage}</Typography>
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
                } }
                renderProcessedIcon={(processed: boolean) => {
                  return processed === true ? (
                    <CheckCircleIcon style={{ color: green[500] }} />
                  ) : (
                    <CancelIcon style={{ color: red[500] }} />
                  );
                } } categories={undefined}          />
        </>
      )}
    </Container>
  );
};

export default Home;
