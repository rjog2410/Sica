import { Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledHeaderToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[1],
  height: '64px', // Fijamos la altura a 64px directamente para eliminar cualquier problema con theme.spacing
}));

export const UserName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontSize: '1.2rem',
}));

export const UserRole = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
  letterSpacing: '0.5px',
}));
