import React from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Box,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description"; // Import des Icons
import { Product } from "../../interfaces/types";

interface RelatedProductsProps {
  relatedProducts: Product[];
  selectedRelatedProducts: string[];
  setSelectedRelatedProducts: React.Dispatch<React.SetStateAction<string[]>>;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  handleAdoptContent: () => void;
  horizontal?: boolean; // neue optionale Eigenschaft für horizontale Ausrichtung
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  relatedProducts,
  selectedRelatedProducts,
  setSelectedRelatedProducts,
  selectAll,
  setSelectAll,
  handleAdoptContent,
  horizontal = false, // Standardwert ist false
}) => {
  const handleSelectAllChange = (
    // eslint-disable-next-line no-undef
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.checked) {
      setSelectedRelatedProducts(relatedProducts.map((p) => p.id));
    } else {
      setSelectedRelatedProducts([]);
    }
    setSelectAll(event.target.checked);
  };

  const handleProductChange = (id: string) => {
    setSelectedRelatedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((pid) => pid !== id)
        : [...prevSelected, id],
    );
  };

  return (
    <div
      style={{
        display: horizontal ? "flex" : "block",
        alignItems: "center",
        border: "1px dashed #333",
        padding: "20px",
      }}
    >
      <FormGroup row={horizontal}>
        <FormControlLabel
          control={
            <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
          }
          label="Select All"
        />
        {relatedProducts.map((product) => {
          const color = product.color?.trim();
          const nameIncludesColor =
            color &&
            color.length > 0 &&
            product.name.toLowerCase().includes(color.toLowerCase());
          const nameHasComma = product.name.includes(",");
          const label =
            color && color.length > 0 && !nameIncludesColor && !nameHasComma
              ? `${product.name}, ${color}`
              : product.name;

          return (
            <Box key={product.id} display="flex" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedRelatedProducts.includes(product.id)}
                    onChange={() => handleProductChange(product.id)}
                  />
                }
                label={label}
              />
              {product.description && (
                <DescriptionIcon style={{ marginLeft: 8 }} />
              )}
            </Box>
          );
        })}
      </FormGroup>
      <Button variant="contained" onClick={handleAdoptContent}>
        Adopt Content
      </Button>
    </div>
  );
};

export default RelatedProducts;
