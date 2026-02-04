import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Product } from "../interfaces/types";
import {
  GridPaginationModel,
  GridSortModel,
  GridFilterModel,
} from "@mui/x-data-grid";
import useFetchManufacturers from "./useFetchManufacturers";

type RawProduct = {
  id: string;
  attributes: {
    manufacturerNumber?: string;
    name?: string;
    stock?: number;
    updatedAt?: string;
    manufacturerId?: string;
    active?: boolean;
    description?: string | null;
    metaDescription?: string | null;
    metaTitle?: string | null;
    keywords?: string | null;
    color?: string | null;
    customFields?: {
      custom_add_product_attributes_short_text?: string | null;
    };
  };
};

type ProductsResponse = {
  products: RawProduct[];
  totalProducts: number | string;
};

const useFetchInitialProducts = (initialSearchTerm: string = "") => {
  const { manufacturers, loading: manufacturersLoading } =
    useFetchManufacturers();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "name", sort: "asc" },
  ]);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [manufacturerIdFilter, setManufacturerIdFilter] = useState<
    string | null
  >(null);

  const fetchInitialProducts = useCallback(
    async (search: string = "") => {
      setLoading(true);
      try {
        const endpoint = search ? "/search-products" : "/products";
        // console.log("🔎 Fetching products with filters:", {
        //   endpoint,
        //   searchTerm: search,
        //   page: paginationModel.page + 1,
        //   limit: paginationModel.pageSize,
        //   sortField: sortModel[0]?.field || "name",
        //   sortDirection: sortModel[0]?.sort || "asc",
        //   filters: filterModel.items,
        //   manufacturerId: manufacturerIdFilter,
        // });

        const response = await axiosInstance.post(endpoint, {
          searchTerm: search,
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          sortField: sortModel[0]?.field || "name",
          sortDirection: sortModel[0]?.sort || "asc",
          filters: filterModel.items,
          manufacturerId: manufacturerIdFilter, // Add this line
        });

        // console.log("📦 Products API response:", {
        //   endpoint,
        //   totalProducts: (response.data as ProductsResponse)?.totalProducts,
        //   productsLength: (response.data as ProductsResponse)?.products?.length,
        // });

        const { products, totalProducts } = response.data as ProductsResponse;

        const productsData = products.map((item: RawProduct) => {
          const attributes = item.attributes || {};
          const manufacturer = manufacturers.find(
            (manufacturerItem) =>
              manufacturerItem.id === attributes.manufacturerId,
          );

          return {
            id: item.id,
            productNumber: attributes.manufacturerNumber || "",
            name: attributes.name || "",
            stock: attributes.stock ?? 0,
            updatedAt: attributes.updatedAt
              ? new Date(attributes.updatedAt).toLocaleDateString()
              : "N/A",
            manufacturer: manufacturer
              ? manufacturer.name
              : "Unknown Manufacturer",
            manufacturerId: attributes.manufacturerId || "",
            status: attributes.active ? "Active" : "Inactive",
            hasContent: Boolean(
              attributes.description ||
                attributes.metaDescription ||
                attributes.metaTitle ||
                attributes.keywords ||
                attributes.customFields
                  ?.custom_add_product_attributes_short_text,
            ),
            color: (item as RawProduct)?.attributes?.color || null,
          } as Product;
        });

        setProducts(productsData);
        setTotalProducts(parseInt(totalProducts as string, 10));
      } catch (fetchError) {
        setError(
          fetchError instanceof Error ? fetchError : new Error("Unknown error"),
        );
      } finally {
        setLoading(false);
      }
    },
    [
      paginationModel,
      sortModel,
      filterModel,
      manufacturers,
      manufacturerIdFilter,
    ],
  );

  useEffect(() => {
    if (!manufacturersLoading) {
      fetchInitialProducts(searchTerm);
    }
  }, [
    fetchInitialProducts,
    searchTerm,
    manufacturersLoading,
    paginationModel,
    sortModel,
    filterModel,
    manufacturerIdFilter,
  ]); // Add manufacturerIdFilter to dependencies

  return {
    products,
    totalProducts,
    loading: loading || manufacturersLoading,
    error,
    paginationModel,
    setPaginationModel,
    sortModel,
    setSortModel,
    searchTerm,
    setSearchTerm,
    filterModel,
    setFilterModel,
    setManufacturerIdFilter, // Add this line
    fetchInitialProducts,
  };
};

export default useFetchInitialProducts;
