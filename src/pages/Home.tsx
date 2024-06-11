import React, { useEffect, useState } from "react";
import ManufacturerSelect from '../components/ManufacturerList';
import ProductTable from '../components/ProductTable';
import { Container } from "@mui/material";
import { formatDate } from "../utils/dateformat";
import axiosInstance from '../utils/axiosInstance';  // Verwenden der Axios-Instanz
import { useManufacturers } from '../context/ManufacturerContext';  // Update the import path as needed
import { Manufacturer, Product } from '../interfaces/types';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

const Home: React.FC = () => {
  const { manufacturers, setManufacturers } = useManufacturers();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ pageSize: 10, page: 0 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'name', sort: 'asc' }]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('');

  // Sortiert die Manufacturer in der Select Liste ASC
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

  // Fetcht die manufacturers vom backend
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

  // Fetcht die InitialProducts vom backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productResponse = await axiosInstance.post('/products', {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          sortField: sortModel[0]?.field || 'name',
          sortDirection: sortModel[0]?.sort || 'asc'
        });
        const { products, totalProducts } = productResponse.data;

        const productsData = products.map((item: any) => {
          const attributes = item.attributes ? item.attributes : {};
          const manufacturer = manufacturers.find(manufacturer => manufacturer.id === attributes.manufacturerId);

          return {
            id: item.id,
            productNumber: attributes.manufacturerNumber || '',
            name: attributes.name || '',
            stock: attributes.stock !== undefined ? attributes.stock : 0, // Ensure stock is always a number
            updatedAt: attributes.updatedAt ? formatDate(new Date(attributes.updatedAt)) : 'N/A', // Ensure updatedAt is always a string
            manufacturer: manufacturer ? manufacturer.name : 'Unknown Manufacturer',
            manufacturerId: attributes.manufacturerId || ''
          } as Product;
        });

        setProducts(productsData);
        setTotalProducts(parseInt(totalProducts));
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [paginationModel, sortModel, manufacturers]);

  const filteredProducts = selectedManufacturer
    ? products.filter(product => product.manufacturerId === selectedManufacturer)
    : products;

  return (
    <Container className='table-container'>
      <ManufacturerSelect
        manufacturers={manufacturers}
        selectedManufacturer={selectedManufacturer}
        setSelectedManufacturer={setSelectedManufacturer}
      />
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!loading && !error && (
        <ProductTable
          products={filteredProducts}
          totalProducts={totalProducts}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          sortModel={sortModel}
          setSortModel={setSortModel}
        />
      )}
    </Container>
  );
};

export default Home;
