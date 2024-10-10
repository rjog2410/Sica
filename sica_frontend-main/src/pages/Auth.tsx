// // src/pages/Auth.tsx
// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Box, CircularProgress } from '@mui/material';
// import useAuthStore from '../store/authStore';
// import verifyToken from '../utils/verify';
// import { useNotification } from '../providers/NotificationProvider';

// const Auth: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuthStore(); 
//   const { notify } = useNotification();
//   const [isLoading, setIsLoading] = useState(true);
//   console.log("en auth");
//   useEffect(() => {
//     const verifyAndNavigate = async () => {
//       const searchParams = new URLSearchParams(location.search);
//       const jwt = searchParams.get('jwt');

//       if (jwt) {
//         // Si hay un JWT, intenta verificarlo
//         const isValid = await verifyToken(jwt, notify);
//         if (isValid) {
//           notify('Autenticación exitosa', 'success');
//           navigate('/', { replace: true }); // Navega a la página principal si es exitoso
//         } else {
//           notify('Token no válido, redirigiendo...', 'error');
//           navigate('/unauthorized', { replace: true }); // Redirige a no autorizado si el token no es válido
//         }
//       } else {
//         // Si no hay JWT, verifica si está autenticado
//         if (isAuthenticated) {
//           navigate('/', { replace: true }); // Ya autenticado, navega a la página principal
//         } else {
//           notify('No autenticado, redirigiendo a inicio de sesión...', 'error');
//           navigate('/unauthorized', { replace: true }); // Redirige a no autorizado si no está autenticado
//         }
//       }

//       setIsLoading(false);
//     };

//     verifyAndNavigate();
//   }, [location.search, navigate, isAuthenticated, notify]);

//   if (isLoading) {
//     return (
//       <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return null;
// };

// export default Auth;

// Auth.tsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Cambia wouter a react-router-dom
import { Box, CircularProgress } from '@mui/material';
import useAuthStore from '../store/authStore';
import verifyToken from '../utils/verify';
import { useNotification } from '../providers/NotificationProvider';

const Auth: React.FC = () => {
  const location = useLocation(); // Cambia a hook de react-router-dom
  const navigate = useNavigate();  // Cambia a hook de react-router-dom
  const { isAuthenticated } = useAuthStore();
  const { notify } = useNotification();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAndNavigate = async () => {
      const searchParams = new URLSearchParams(location.search);  // Usar location.search para obtener los query params
      const jwt = searchParams.get('jwt');

      if (jwt) {
        // Si hay un JWT, intenta verificarlo
        const isValid = await verifyToken(jwt, notify);
        if (isValid) {
          // notify('Autenticacion Exitosa.','success');
          navigate('/', { replace: true }); // Ya autenticado, navega a la página principal
        } else {
          notify('Token no válido, redirigiendo...', 'error');
          navigate('/unauthorized', { replace: true }); // Redirige a no autorizado si el token no es válido
        }
      } 
      // else {
      //   // Si no hay JWT, verifica si está autenticado
      //   if (isAuthenticated) {
      //     navigate('/', { replace: true }); // Ya autenticado, navega a la página principal
      //   } else {
      //     notify('No autenticado, redirigiendo a inicio de sesión...', 'error');
      //     navigate('/unauthorized', { replace: true }); // Redirige a no autorizado si no está autenticado
      //   }
      // }

      setIsLoading(false);
    };

    verifyAndNavigate();
  }, [location, navigate, isAuthenticated, notify]);

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return null;
};

export default Auth;

