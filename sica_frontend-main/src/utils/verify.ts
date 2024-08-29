// src/utils/verify.ts

import { AxiosError } from 'axios'; // Importar AxiosError desde axios
import { axiosInstance } from '../api/axiosSetup'; // Asegúrate de que la ruta sea correcta
import useAuthStore from '../store/authStore'; // Asegúrate de que la ruta sea correcta
import { NotificationContextProps, VerifyTokenResponse } from '../types'; // Importar tipos desde el archivo de tipos

// Función para verificar el token JWT
const verifyToken = async (jwt: string, notify: NotificationContextProps["notify"]): Promise<boolean> => {
  // Obtener la función para establecer el usuario en el estado
  const setUser = useAuthStore.getState().setUser;

  try {
    console.log('Verificando token:', jwt);

    // Realizar la solicitud para verificar el token
    const response = await axiosInstance.get<{
      expectedProperty: any; data: { expectedProperty: VerifyTokenResponse } 
}>('/verify', {
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    console.log('Respuesta completa recibida:', response);
    console.log('Datos recibidos:', response.data);

    // Accede correctamente a los datos de la respuesta
    const userData = response.data.expectedProperty; // Asegúrate de acceder al nivel correcto

    console.log('Datos de usuario:', userData);

    if (response.status === 200 && userData) {
      setUser({
        id: userData.id,
        name: userData.name,
        username: userData.username,
        jwt: userData.jwt,
        roles: userData.roles,
        permissions: userData.permissions,
      }, jwt);
      console.log('Usuario establecido correctamente');
      return true;
    } else {
      notify('Token no válido', 'error');
      console.error('Formato de respuesta inválido:', response.data);
    }
  } catch (error) {
    // Manejar errores de Axios
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;
      console.error('Error de Axios al verificar el token:', axiosError.message);
      if (axiosError.response) {
        const responseData = axiosError.response.data as any; // Puedes hacer un cast a `any` si es necesario
        console.error('Datos de respuesta:', responseData);
        console.error('Estado de respuesta:', axiosError.response.status);
        notify('Error al verificar el token: ' + (responseData.detail || 'Error desconocido'), 'error');
      }
    } else if (error instanceof Error) {
      // Manejar otros tipos de errores
      console.error('Error al verificar el token:', error.message);
      notify('Error al verificar el token: ' + error.message, 'error');
    } else {
      // Manejar errores desconocidos
      console.error('Error desconocido al verificar el token');
      notify('Error desconocido al verificar el token', 'error');
    }
  }

  return false;
};

export default verifyToken;
