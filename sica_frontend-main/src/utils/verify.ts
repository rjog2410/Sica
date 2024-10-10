// // src/utils/verify.ts

// import { AxiosError } from 'axios'; // Importar AxiosError desde axios
// import { axiosInstance } from '../api/axiosSetup'; // Asegúrate de que la ruta sea correcta
// import useAuthStore from '../store/authStore'; // Asegúrate de que la ruta sea correcta
// import { NotificationContextProps, VerifyTokenResponse } from '../types'; // Importar tipos desde el archivo de tipos

// // Función para verificar el token JWT
// const verifyToken = async (jwt: string, notify: NotificationContextProps["notify"]): Promise<boolean> => {
//   // Obtener la función para establecer el usuario en el estado
//   const setUser = useAuthStore.getState().setUser;

//   try {
//     console.log('Verificando token:', jwt);
//     // Realizar la solicitud para verificar el token
//     const response = await axiosInstance.post('/auth/validateToken', null, {
//       headers: {
//         'Authorization': `Bearer ${jwt}`,
//       },
//     });

//     console.log('Respuesta completa recibida:', response.data);

//     console.log('Respuesta completa recibida:', response);
//     console.log('Datos recibidos:', response.data);

//     // Accede correctamente a los datos de la respuesta
//     const userData = response.data.expectedProperty; // Asegúrate de acceder al nivel correcto

//     console.log('Datos de usuario:', userData);

//     if (response.status === 200 && userData) {
//       setUser({
//         id: userData.id,
//         name: userData.name,
//         username: userData.username,
//         jwt: userData.jwt,
//         roles: userData.roles,
//         permissions: userData.permissions,
//       }, jwt);
//       console.log('Usuario establecido correctamente');
//       return true;
//     } else {
//       notify('Token no válido', 'error');
//       console.error('Formato de respuesta inválido:', response.data);
//     }
//   } catch (error) {
//     // Manejar errores de Axios
//     if ((error as AxiosError).isAxiosError) {
//       const axiosError = error as AxiosError;
//       console.error('Error de Axios al verificar el token:', axiosError.message);
//       if (axiosError.response) {
//         const responseData = axiosError.response.data as any; // Puedes hacer un cast a `any` si es necesario
//         console.error('Datos de respuesta:', responseData);
//         console.error('Estado de respuesta:', axiosError.response.status);
//         notify('Error al verificar el token: ' + (responseData.detail || 'Error desconocido'), 'error');
//       }
//     } else if (error instanceof Error) {
//       // Manejar otros tipos de errores
//       console.error('Error al verificar el token:', error.message);
//       notify('Error al verificar el token: ' + error.message, 'error');
//     } else {
//       // Manejar errores desconocidos
//       console.error('Error desconocido al verificar el token');
//       notify('Error desconocido al verificar el token', 'error');
//     }
//   }

//   return false;
// };

// export default verifyToken;


import { AxiosError } from 'axios'; // Importar AxiosError desde axios
import { axiosInstance } from '../api/axiosSetup'; // Asegúrate de que la ruta sea correcta
import useAuthStore from '../store/authStore'; // Asegúrate de que la ruta sea correcta
import { NotificationContextProps, VerifyTokenResponse, User } from '../types/types'; // Importar tipos desde el archivo de tipos

// Función para verificar el token JWT y luego obtener datos del usuario
const verifyToken = async (jwt: string, notify: NotificationContextProps["notify"]): Promise<boolean> => {
  const setUser = useAuthStore.getState().setUser;

  try {
    console.log('Verificando token:', jwt);

    // 1. Validar el token en la primera API (/auth/validateToken)
    const validationResponse = await axiosInstance.post('/auth/validateToken', null, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    if (validationResponse.status !== 200) {
      notify('Token no válido', 'error');
      return false;
    }

    console.log('Token válido, procediendo a obtener datos del usuario');

    // 2. Si el token es válido, realizar la segunda solicitud para obtener los datos del usuario (/seguridad/usuarios/get_initial_data)
    const userResponse = await axiosInstance.post('/session/getUserData', null, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    console.log('Datos del usuario recibidos:', userResponse.data);


    const userData: User = userResponse.data.data;

    if (userResponse.status === 200 && userData) {
      setUser({
        id: userData.id,           // Ajustado a la estructura real de los datos de usuario
        name: userData?.name,       // Nombre del usuario
        username: userData?.username, // Username del usuario
        roles: userData?.roles,     // Array de roles
        permissions: userData?.permissions, // Array de permisos/rutas
      }, jwt);
      notify('Autenticación exitosa', 'success');
      return true;
    } else {
      notify('No se pudieron obtener los datos del usuario', 'error');
      console.error('Formato de respuesta inválido:', userResponse.data);
      return false;
    }

  } catch (error) {
    // Manejar errores de Axios o generales
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;
      console.error('Error de Axios al verificar el token o obtener los datos del usuario:', axiosError.message);
      if (axiosError.response) {
        const responseData = axiosError.response.data as any; // Cast a `any` si es necesario
        console.error('Datos de respuesta:', responseData);
        notify('Error en la verificación o al obtener datos: ' + (responseData.detail || 'Error desconocido'), 'error');
      }
    } else if (error instanceof Error) {
      // Manejar otros tipos de errores
      console.error('Error al verificar el token o obtener los datos:', error.message);
      notify('Error: ' + error.message, 'error');
    } else {
      // Manejar errores desconocidos
      console.error('Error desconocido al verificar el token o obtener los datos');
      notify('Error desconocido', 'error');
    }
  }

  return false;
};

export default verifyToken;
