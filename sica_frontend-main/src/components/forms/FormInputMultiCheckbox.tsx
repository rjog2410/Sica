import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormControlLabel, FormLabel, Checkbox, FormGroup } from '@mui/material';
import { FormInputProps } from './FormProps';

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
];

const FormInputMultiCheckbox: React.FC<FormInputProps> = ({ name, control, label }) => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={<Checkbox {...field} value={option.value} />}
                label={option.label}
              />
            ))}
          </FormGroup>
        )}
      />
    </FormControl>
  );
};

export default FormInputMultiCheckbox;
