// Archivo: Content.tsx
// Path: /src/components/base/Content.tsx

import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface ContentProps {
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ sx, children }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        marginLeft: 0, // El contenido se ajusta automáticamente cuando el sidebar está oculto
        marginTop: '64px', // Asegura que el contenido esté debajo del header
        transition: 'margin 0.3s ease',
        padding: '10px',
        backgroundColor: '#E8F0F4',
        borderRadius:2,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default Content;
