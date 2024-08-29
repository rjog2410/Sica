// src/pages/Unauthorized.tsx
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import useAuthStore from '../store/authStore';
import { useNotification } from '../providers/NotificationProvider';

const Unauthorized: React.FC = () => {
  const { logoutInitiated, setLogoutInitiated } = useAuthStore();
  const { notify } = useNotification();

  useEffect(() => {
    if (logoutInitiated) {
      notify('Cierre de sesión exitoso', 'success');
      setLogoutInitiated(false); // Resetea la bandera
    } else {
      notify('No autorizado para acceder a esta página', 'error');
    }
  }, [logoutInitiated, notify, setLogoutInitiated]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4" gutterBottom>
        Unauthorized
      </Typography>
      <Typography variant="body1">
        You do not have access to this page.
      </Typography>
    </Box>
  );
};

export default Unauthorized;
