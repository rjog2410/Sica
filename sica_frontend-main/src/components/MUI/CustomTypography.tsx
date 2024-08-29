import React from 'react';
import { Typography } from '@mui/material';

interface CustomTypographyProps {
  text: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline';
}

const CustomTypography: React.FC<CustomTypographyProps> = ({ text, variant = 'body1' }) => {
  return (
    <Typography variant={variant}>
      {text}
    </Typography>
  );
};

export default CustomTypography;
