import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Manufacturer } from '../interfaces/types'; 

interface ManufacturerSelectProps {
  manufacturers: Manufacturer[];
  selectedManufacturer: string;
  setSelectedManufacturer: (manufacturer: string) => void;
}

const ManufacturerSelect: React.FC<ManufacturerSelectProps> = ({ manufacturers, selectedManufacturer, setSelectedManufacturer }) => {
  const handleChange = (event: any, value: Manufacturer | null) => {
    setSelectedManufacturer(value ? value.id : '');
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <Autocomplete
        options={manufacturers}
        getOptionLabel={(option) => option.name}
        value={manufacturers.find(manufacturer => manufacturer.id === selectedManufacturer) || null}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Manufacturer"
            variant="outlined"
            fullWidth
          />
        )}
      />
    </Box>
  );
};

export default ManufacturerSelect;
