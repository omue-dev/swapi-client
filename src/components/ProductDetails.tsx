import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Grid,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import ProductDescription from "./common/ProductDescription";
import MetaDataFields from "./common/MetaDataFields";
import RelatedProducts from "./common/RelatedProducts";
import { Product } from "../interfaces/types";
import useFetchProduct from "../hooks/useFetchProduct";
import useFetchRelatedProducts from "../hooks/useFetchRelatedProducts";
import useUpdateProduct from "../hooks/useUpdateProduct";
import "./ProductDetails.css";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<
    string[]
  >([]);
  const [selectAll, setSelectAll] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const {
    product: productData,
    loading: productLoading,
    error: productError,
  } = useFetchProduct(id || "");
  const {
    relatedProducts,
    loading: relatedProductsLoading,
    error: relatedProductsError,
  } = useFetchRelatedProducts(productData?.name || "");
  const {
    updateProduct,
    loading: updateLoading,
    error: updateError,
  } = useUpdateProduct();

  useEffect(() => {
    if (productError) setError(productError);
    else setProduct(productData);
  }, [productData, productError]);

  useEffect(() => {
    if (relatedProductsError) setError(relatedProductsError);
  }, [relatedProductsError]);

  const getFormData = (product: Product) => {
    const {
      id = "",
      name = "",
      description = "",
      metaDescription = "",
      metaTitle = "",
      keywords = "",
      shortText = "",
      gender = "",
      color = "",
    } = product || {};

    const trimmedColor = color?.trim();
    const nameIncludesColor =
      trimmedColor &&
      trimmedColor.length > 0 &&
      name.toLowerCase().includes(trimmedColor.toLowerCase());
    const hasCommaInName = name.includes(",");
    const nameWithColor =
      trimmedColor &&
      trimmedColor.length > 0 &&
      !nameIncludesColor &&
      !hasCommaInName
        ? `${name}, ${trimmedColor}`
        : name;

    return {
      id,
      name: nameWithColor,
      description,
      metaDescription,
      metaTitle,
      keywords,
      customFields: {
        custom_add_product_attributes_short_text: shortText,
        custom_add_product_attributes_gender: gender,
      },
    };
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!product) return;
    const formData = getFormData(product);

    const buildNameWithColor = (name: string, color?: string | null) => {
      const trimmedColor = color?.trim();
      if (!trimmedColor) return name;
      const hasComma = name.includes(",");
      const hasColor =
        trimmedColor.length > 0 &&
        name.toLowerCase().includes(trimmedColor.toLowerCase());
      return hasComma || hasColor ? name : `${name}, ${trimmedColor}`;
    };

    const relatedProductsData = selectedRelatedProducts.map((id) => {
      const rp = relatedProducts.find((p) => p.id === id);
      const nameWithColor = rp
        ? buildNameWithColor(rp.name || "", rp.color || null)
        : undefined;
      return { id, name: nameWithColor };
    });

    try {
      setError(null);
      await updateProduct(formData, relatedProductsData, () => {
        setSnackbarMessage("Update Successful!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    }
  };

  const handleAdoptContent = useCallback(() => {
    const productWithDescription = relatedProducts.find((p) => p.description);

    if (productWithDescription) {
      setProduct((prevProduct) => {
        if (!prevProduct) return null;

        return {
          ...prevProduct,
          description:
            productWithDescription.description || prevProduct.description,
          shortText: productWithDescription.shortText || prevProduct.shortText,
          metaTitle: productWithDescription.metaTitle || prevProduct.metaTitle,
          metaDescription:
            productWithDescription.metaDescription ||
            prevProduct.metaDescription,
          keywords: productWithDescription.keywords || prevProduct.keywords,
          gender: productWithDescription.gender || prevProduct.gender,
        };
      });
    }
  }, [relatedProducts]);

  useEffect(() => {
    if (updateError) {
      setSnackbarMessage(updateError);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [updateError]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleMetaTitleChange = (
    // eslint-disable-next-line no-undef
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newMetaTitle = event.target.value;
    setProduct((prevProduct) =>
      prevProduct ? { ...prevProduct, metaTitle: newMetaTitle } : null,
    );
  };

  const handleMetaDescriptionChange = (
    // eslint-disable-next-line no-undef
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newMetaDescription = event.target.value;
    setProduct((prevProduct) =>
      prevProduct
        ? { ...prevProduct, metaDescription: newMetaDescription }
        : null,
    );
  };

  const metaTitleLength = product?.metaTitle?.length || 0;
  const metaDescriptionLength = product?.metaDescription?.length || 0;

  const metaTitleColor = metaTitleLength <= 80 ? "green" : "red";
  const metaDescriptionColor = metaDescriptionLength <= 250 ? "green" : "red";

  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (productLoading || relatedProductsLoading)
    return <Typography>Loading...</Typography>;

  const trimmedHeadlineColor = product?.color?.trim() || "";
  const headlineName = product?.name || "";
  const headlineHasColor =
    trimmedHeadlineColor.length > 0 &&
    headlineName.toLowerCase().includes(trimmedHeadlineColor.toLowerCase());
  const headlineDisplayName =
    trimmedHeadlineColor.length > 0 && !headlineHasColor
      ? `${headlineName}, ${trimmedHeadlineColor}`
      : headlineName;
  const headlineBase = [product?.productNumber, headlineDisplayName]
    .filter(Boolean)
    .join(" - ");
  const headline = headlineBase;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {headline}
      </Typography>
      <form onSubmit={handleSave}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ProductDescription product={product} setProduct={setProduct} />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* Gender Select List */}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="gender-label">Geschlecht</InputLabel>
              <Select
                key={product?.gender || "no-gender"}
                labelId="gender-label"
                id="gender"
                value={product?.gender || ""}
                label="Geschlecht"
                onChange={(e) =>
                  setProduct((prev) =>
                    prev ? { ...prev, gender: e.target.value } : prev,
                  )
                }
              >
                <MenuItem value="">–</MenuItem>
                <MenuItem value="Damen">Damen</MenuItem>
                <MenuItem value="Herren">Herren</MenuItem>
                <MenuItem value="Unisex">Unisex</MenuItem>
              </Select>
            </FormControl>
            {relatedProducts.length > 1 && (
              <RelatedProducts
                relatedProducts={relatedProducts}
                selectedRelatedProducts={selectedRelatedProducts}
                setSelectedRelatedProducts={setSelectedRelatedProducts}
                selectAll={selectAll}
                setSelectAll={setSelectAll}
                handleAdoptContent={handleAdoptContent}
              />
            )}
            <MetaDataFields
              product={product}
              setProduct={setProduct}
              metaTitleColor={metaTitleColor}
              metaDescriptionColor={metaDescriptionColor}
              metaTitleLength={metaTitleLength}
              metaDescriptionLength={metaDescriptionLength}
              handleMetaTitleChange={handleMetaTitleChange}
              handleMetaDescriptionChange={handleMetaDescriptionChange}
            />
          </Grid>
        </Grid>
        <Box className="sticky-save-button">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={updateLoading}
          >
            {updateLoading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </Box>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails;
