import React from 'react';
import { Controller } from 'react-hook-form';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FormInputProps } from './FormProps';

const FormInputDate: React.FC<FormInputProps> = ({ name, control, label }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            label={label}
            slotProps={{ textField: { variant: 'outlined', fullWidth: true } }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default FormInputDate;
