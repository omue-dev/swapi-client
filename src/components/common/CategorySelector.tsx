import React from 'react';
import { Autocomplete, TextField, Box, Paper, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Category } from '../../interfaces/types';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: Category[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  handleCategoryChange: (event: any, newValue: any) => void;
  handleDeleteCategory: (id: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategories,
  handleCategoryChange,
  handleDeleteCategory
}) => {
  return (
    <>
      <Autocomplete
        options={categories}
        getOptionLabel={(option) => option.name}
        onChange={handleCategoryChange}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>{option.name}</li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Select Category" variant="outlined" fullWidth />
        )}
      />
      {selectedCategories.length > 0 && (
        <Box mt={2}>
          <Typography variant="body1">Selected Categories:</Typography>
          {selectedCategories.map(category => (
            <Paper key={category.id} elevation={2} sx={{ display: 'flex', alignItems: 'center', padding: '8px', marginBottom: '8px' }}>
              <Typography variant="body1" sx={{ flexGrow: 1 }}>{category.name}</Typography>
              <IconButton aria-label="delete" onClick={() => handleDeleteCategory(category.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}
    </>
  );
};

export default CategorySelector;
