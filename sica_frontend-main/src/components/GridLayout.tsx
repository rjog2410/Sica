import React from 'react';
import { Grid, Container } from '@mui/material';

const GridLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Container>
      <Grid container spacing={3}>
        {children}
      </Grid>
    </Container>
  );
};

export default GridLayout;
