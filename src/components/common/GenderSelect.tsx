import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Product } from '../../interfaces/types';
import { GENDER_OPTIONS } from '../../constants';

interface GenderSelectProps {
  product: Product | null;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

const GenderSelect: React.FC<GenderSelectProps> = ({ product, setProduct }) => {
  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel id="gender-label">Geschlecht</InputLabel>
      <Select
        key={product?.gender || 'no-gender'}
        labelId="gender-label"
        id="gender"
        value={product?.gender || ''}
        label="Geschlecht"
        onChange={(e) =>
          setProduct((prev) =>
            prev ? { ...prev, gender: e.target.value } : prev
          )
        }
      >
        {GENDER_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GenderSelect;
