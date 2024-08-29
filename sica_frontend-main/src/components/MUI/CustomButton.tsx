import React from 'react';
import { Button, ButtonProps, SxProps } from '@mui/material';

interface CustomButtonProps {
  onClick: () => void;
  label: string;
  icon?: React.ReactNode; // Añadimos una propiedad opcional para el icono
  variant?: 'text' | 'outlined' | 'contained';
  color?: ButtonProps['color'];
  sx?: SxProps; // Añadimos la propiedad sx para estilos adicionales
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, label, icon, variant = 'contained', color = 'primary', sx }) => {
  return (
    <Button onClick={onClick} variant={variant} color={color} startIcon={icon} sx={sx}>
      {label}
    </Button>
  );
};

export default CustomButton;
