import React from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Box, Typography, Button } from '@mui/material';
import { Product } from '../../interfaces/types';

interface RelatedProductsProps {
  relatedProducts: Product[];
  selectedRelatedProducts: string[];
  setSelectedRelatedProducts: React.Dispatch<React.SetStateAction<string[]>>;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  handleAdoptContent: () => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  relatedProducts,
  selectedRelatedProducts,
  setSelectedRelatedProducts,
  selectAll,
  setSelectAll,
  handleAdoptContent
}) => {
  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setSelectAll(checked);
    setSelectedRelatedProducts(checked ? relatedProducts.map(product => product.id) : []);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: productId, checked } = event.target;
    setSelectedRelatedProducts(prevSelected =>
      checked ? [...prevSelected, productId] : prevSelected.filter(id => id !== productId)
    );
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Related Products</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={selectAll} onChange={handleSelectAllChange} />}
          label="Select All"
        />
        {relatedProducts.map(relatedProduct => (
          <Box key={relatedProduct.id} mb={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedRelatedProducts.includes(relatedProduct.id)}
                  onChange={handleCheckboxChange}
                  value={relatedProduct.id}
                />
              }
              label={relatedProduct.name}
            />
          </Box>
        ))}
      </FormGroup>
      <Box mt={2}>
        <Typography variant="body1">Es sind bereits Inhalte vorhanden.</Typography>
        <Button variant="contained" color="primary" onClick={handleAdoptContent}>
          Inhalte übernehmen
        </Button>
      </Box>
    </FormControl>
  );
};

export default RelatedProducts;
