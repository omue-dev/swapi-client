import React from "react";
import { Product } from "../../interfaces/types";
import TextField from "@mui/material/TextField";
import { Typography, Box } from "@mui/material";

interface MetaDataFieldsProps {
  product: Product | null;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  metaTitleColor: string;
  metaDescriptionColor: string;
  metaTitleLength: number;
  metaDescriptionLength: number;
  handleMetaTitleChange: (
    // eslint-disable-next-line no-undef
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleMetaDescriptionChange: (
    // eslint-disable-next-line no-undef
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const MetaDataFields: React.FC<MetaDataFieldsProps> = ({
  product,
  setProduct,
  metaTitleColor,
  metaDescriptionColor,
  metaTitleLength,
  metaDescriptionLength,
  handleMetaTitleChange,
  handleMetaDescriptionChange,
}) => {
  return (
    <>
      <Box mb={2}>
        <TextField
          label="Meta Title"
          multiline
          fullWidth
          rows={3}
          value={product?.metaTitle || ""}
          onChange={(e) => {
            setProduct((prev) =>
              prev ? { ...prev, metaTitle: e.target.value } : null,
            );
            handleMetaTitleChange(e);
          }}
          InputProps={{
            endAdornment: (
              <Typography variant="caption" sx={{ color: metaTitleColor }}>
                {metaTitleLength}/80
              </Typography>
            ),
          }}
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Meta Description"
          multiline
          fullWidth
          rows={6}
          value={product?.metaDescription || ""}
          onChange={(e) => {
            setProduct((prev) =>
              prev ? { ...prev, metaDescription: e.target.value } : null,
            );
            handleMetaDescriptionChange(e);
          }}
          InputProps={{
            endAdornment: (
              <Typography
                variant="caption"
                sx={{ color: metaDescriptionColor }}
              >
                {metaDescriptionLength}/250
              </Typography>
            ),
          }}
        />
      </Box>
      <TextField
        label="Keywords"
        multiline
        fullWidth
        rows={6}
        value={product?.keywords || ""}
        onChange={(e) =>
          setProduct((prev) =>
            prev ? { ...prev, keywords: e.target.value } : null,
          )
        }
      />
    </>
  );
};

export default MetaDataFields;
