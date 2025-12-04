import { useState } from "react";
import type { AxiosError } from "axios";
import axiosInstance from "../utils/axiosInstance";

type UpdateFormData = Record<string, unknown>;
type RelatedProductUpdate = { id: string; name?: string };
type OnSuccessCallback = (updatedProduct: unknown) => void;

const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateProduct = async (
    formData: UpdateFormData,
    relatedProductsUpdates: RelatedProductUpdate[],
    onSuccess?: OnSuccessCallback,
  ) => {
    setLoading(true);
    try {
      setError(null);
      setSuccess(false);

      if (!relatedProductsUpdates || relatedProductsUpdates.length === 0) {
        // Update the main product
        const productResponse = await axiosInstance.post(
          "/update-main-product",
          formData,
        );
        const item: { success: boolean; updatedProduct: unknown } =
          productResponse.data;

        if (item.success) {
          setSuccess(true);
          if (onSuccess) onSuccess(item.updatedProduct);
        } else {
          setError("Error updating product");
        }
      } else {
        // Update related products: avoid overwriting their names unless provided per product
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { name: _discardName, ...restFormData } = formData;
        const updateData = {
          updates: relatedProductsUpdates,
          formData: restFormData,
        };

        try {
          console.log("updateData:", updateData);
          await axiosInstance.post("/update-related-products", updateData);
          // ich muss zuerst die id's und dann die formData übergeben.
          setSuccess(true);
          if (onSuccess) onSuccess(formData);
        } catch (updateError) {
          console.error("Error updating related products:", updateError);
          setError("Error updating related products");
        }
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      if (axiosError.response) {
        setError(
          `Error ${axiosError.response.status}: ${axiosError.response.data?.message || "Unknown error"}`,
        );
      } else if (axiosError.request) {
        setError("No response received from the server");
      } else if (err instanceof Error) {
        setError(err.message || "Unknown error");
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return { updateProduct, loading, error, success };
};

export default useUpdateProduct;
