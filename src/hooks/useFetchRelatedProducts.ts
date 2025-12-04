import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Product } from "../interfaces/types";

type ApiProductAttributes = {
  customFields?: Record<string, string>;
  name?: string;
  active?: boolean;
  description?: string;
  customSearchKeywords?: string;
  ean?: string;
  metaDescription?: string;
  metaTitle?: string;
  keywords?: string;
  categoryIds?: string[];
  stock?: number;
  status?: string;
  hasContent?: boolean;
  gender?: string;
  shortText?: string;
  color?: string | null;
};

type ApiProduct = {
  id?: string;
  name?: string;
  gender?: string;
  productNumber?: string;
  shortText?: string;
  active?: boolean;
  description?: string;
  customSearchKeywords?: string;
  ean?: string;
  metaDescription?: string;
  metaTitle?: string;
  keywords?: string;
  categoryIds?: string[];
  stock?: number;
  status?: string;
  hasContent?: boolean;
  color?: string | null;
  customFields?: Record<string, string>;
  data?: {
    id?: string;
    attributes?: ApiProductAttributes;
  };
  attributes?: ApiProductAttributes;
};

const mapApiProductToProduct = (item: ApiProduct): Product => {
  const attributes = item?.data?.attributes || item?.attributes || item || {};

  const customFields =
    attributes.customFields ||
    item?.customFields ||
    item?.data?.attributes?.customFields ||
    {};

  const gender = item?.gender || attributes.gender || "";
  const categoryIds = attributes.categoryIds || item?.categoryIds || [];
  const color = attributes.color || item?.color || null;

  return {
    id: item?.data?.id || item?.id || "",
    name: attributes.name || item?.name || "",
    active: attributes.active || item?.active || false,
    description: attributes.description || item?.description || "",
    customSearchKeywords:
      attributes.customSearchKeywords || item?.customSearchKeywords || "",
    ean: attributes.ean || item?.ean || "",
    metaDescription: attributes.metaDescription || item?.metaDescription || "",
    metaTitle: attributes.metaTitle || item?.metaTitle || "",
    keywords: attributes.keywords || item?.keywords || "",
    categoryIds,
    productNumber:
      customFields.custom_add_product_attributes_oomodellcode ||
      item?.productNumber ||
      "",
    shortText:
      customFields.custom_add_product_attributes_short_text ||
      attributes.shortText ||
      item?.shortText ||
      "",
    stock: attributes.stock || item?.stock || 0,
    gender,
    color,
    status: attributes.status || item?.status || "",
    hasContent: attributes.hasContent || item?.hasContent || false,
  };
};

const useFetchRelatedProducts = (productName: string) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productName) {
      setError(null);
      setRelatedProducts([]);
      setLoading(false);
      return;
    }

    const fetchRelatedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.post("/related-products", {
          productName,
        });
        const apiProducts = response.data.relatedProducts || [];
        const mappedProducts = apiProducts.map(mapApiProductToProduct);
        setRelatedProducts(mappedProducts);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productName]);

  return { relatedProducts, loading, error };
};

export default useFetchRelatedProducts;
