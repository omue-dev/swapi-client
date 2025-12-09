/* eslint-env browser */
import React, { useEffect, useCallback, useState } from "react";
import ProductTable from "../components/ProductTable";
import {
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Button,
  Box,
  MenuItem,
  Chip,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { green, red } from "@mui/material/colors";
import ClearIcon from "@mui/icons-material/Clear";
import useFetchInitialProducts from "../hooks/useFetchInitialProducts";
import useFetchManufacturers from "../hooks/useFetchManufacturers";
import debounce from "lodash.debounce";

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
  const { manufacturers, loading: manufacturersLoading } =
    useFetchManufacturers();

  const [selectedManufacturer, setSelectedManufacturer] = useState<
    string | null
  >(null);

  const debouncedFetchProducts = useCallback(
    debounce((searchValue: string) => {
      fetchInitialProducts(searchValue);
    }, 300),
    [fetchInitialProducts],
  );

  useEffect(() => {
    const storedManufacturerId = window.localStorage.getItem("manufacturerId");
    if (storedManufacturerId) {
      setSelectedManufacturer(storedManufacturerId);
      setManufacturerIdFilter(storedManufacturerId);
    }
  }, [setManufacturerIdFilter]);

  // eslint-disable-next-line no-undef
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    debouncedFetchProducts(searchValue);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchInitialProducts("");
  };

  const handleManufacturerSelect = (
    // eslint-disable-next-line no-undef
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const manufacturerId = event.target.value || null;
    setSelectedManufacturer(manufacturerId);
    setManufacturerIdFilter(manufacturerId);
    if (manufacturerId) {
      window.localStorage.setItem("manufacturerId", manufacturerId);
    } else {
      window.localStorage.removeItem("manufacturerId");
    }
  };

  const handleManufacturerClick = (manufacturerId: string) => {
    console.log("Manufacturer clicked:", manufacturerId); // Log the manufacturerId
    setManufacturerIdFilter(manufacturerId);
    setSelectedManufacturer(manufacturerId);
    window.localStorage.setItem("manufacturerId", manufacturerId);
    // No need to call fetchInitialProducts here, useEffect will handle it
  };

  const handleClearManufacturerFilter = () => {
    console.log("Clearing manufacturer filter");
    setManufacturerIdFilter(null);
    setSelectedManufacturer(null);
    window.localStorage.removeItem("manufacturerId");
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Produktpflege</p>
          <h1>Katalog</h1>
          <p className="muted">
            Finde, filtere und kuratiere deine Produkte mit einem klaren,
            schnellen UI.
          </p>
        </div>
        <div className="header-actions">
          <button className="pill primary">+ Produkt</button>
          <button className="pill ghost">Exportieren</button>
        </div>
      </div>

      <div className="panel">
        <Box className="panel-head">
          <Typography variant="subtitle1" fontWeight={700}>
            Filter & Suche
          </Typography>
          <Chip label={`${totalProducts ?? 0} Produkte`} color="success" />
        </Box>
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          flexWrap="wrap"
          marginBottom={selectedManufacturer ? 0 : 2}
        >
          <TextField
            label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth={!selectedManufacturer}
            size="small"
            sx={{ minWidth: selectedManufacturer ? 240 : undefined, flex: 1 }}
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
          <TextField
            select
            label="Filter by manufacturer"
            value={selectedManufacturer || ""}
            onChange={handleManufacturerSelect}
            variant="outlined"
            fullWidth={false}
            size="small"
            sx={{ minWidth: 260, flex: 1 }}
            disabled={manufacturersLoading}
          >
            <MenuItem value="">All manufacturers</MenuItem>
            {manufacturers.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name}
              </MenuItem>
            ))}
          </TextField>
          {selectedManufacturer && (
            <Button
              onClick={handleClearManufacturerFilter}
              variant="outlined"
              color="secondary"
              sx={{ whiteSpace: "nowrap" }}
            >
              Clear Filter
            </Button>
          )}
        </Box>
      </div>

      <div className="panel datagrid-card">
        {loading ? (
          <div className="centered">
            <CircularProgress />
          </div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <ProductTable
            products={products}
            totalProducts={totalProducts}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            sortModel={sortModel}
            setSortModel={setSortModel}
            renderStatusIcon={(status: string) => {
              return status === "Active" ? (
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
    </div>
  );
};

export default Home;
