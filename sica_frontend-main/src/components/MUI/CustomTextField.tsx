import React from 'react';
import { TextField } from '@mui/material';

interface CustomTextFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({ label, value, onChange }) => {
  return (
    <TextField label={label} value={value} onChange={onChange} variant="outlined" fullWidth />
  );
};

export default CustomTextField;
