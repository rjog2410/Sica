// src/components/base/tabla/forms/DynamicComboBox.tsx
import React, { useState } from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';

interface ComboBoxProps<T> {
  options: T[];
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue: (option: T, value: T) => boolean;
  onSelect: (selected: T | null) => void;
  label: string;
}

const DynamicComboBox = <T,>({ options, getOptionLabel, isOptionEqualToValue, onSelect, label }: ComboBoxProps<T>) => {
  const [selectedOption, setSelectedOption] = useState<T | null>(null);

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: T | null
  ) => {
    setSelectedOption(value);
    onSelect(value);
  };

  return (
    <Box sx={{ minWidth: 300 }}>
      <Autocomplete
        options={options}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label={label} 
            variant="outlined" 
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#1976d2',
                },
                '&:hover fieldset': {
                  borderColor: '#115293',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0d47a1',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#1976d2',
                '&.Mui-focused': {
                  color: '#0d47a1',
                },
              },
            }}
          />
        )}
        onChange={handleChange}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => (
          <li {...props} style={{ fontWeight: getOptionLabel(option) === 'Todos' ? 'bold' : 'normal' }}>
            {getOptionLabel(option)}
          </li>
        )}
        sx={{
          '& .MuiAutocomplete-option[data-focus="true"]': {
            backgroundColor: '#e3f2fd',
          },
          '& .MuiAutocomplete-option[aria-selected="true"]': {
            backgroundColor: '#bbdefb',
          },
        }}
      />
    </Box>
  );
};

export default DynamicComboBox;
