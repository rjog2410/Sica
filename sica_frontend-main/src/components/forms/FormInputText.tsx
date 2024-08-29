import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { FormInputProps } from './FormProps';

const FormInputText: React.FC<FormInputProps> = ({ name, control, label }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          variant="outlined"
          fullWidth
          error={!!error}
          helperText={error ? error.message : null}
        />
      )}
    />
  );
};

export default FormInputText;
