// Archivo: theme.ts
// Path: /src/theme.ts

import { createTheme } from '@mui/material/styles';

// Extender PaletteOptions para incluir propiedades personalizadas
declare module '@mui/material/styles' {
  interface Palette {
    sidebar: {
      background: string;
      NAFIN: string;
    };
    menuItem: {
      primary: string;
    };
  }
  interface PaletteOptions {
    sidebar?: {
      background?: string;
      NAFIN?: string;
    };
    menuItem?: {
      primary?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    sidebar: {
      background: '#1a1a1a',
      NAFIN: '#00708F',
    },
    menuItem: {
      primary: '#FFFFFF',
    },
  },
});

export default theme;
