import axios from 'axios';
import { TraductorParams } from '../../types';

// Reemplaza con la URL real de tu API
const API_URL = 'https://tu-api-url.com/traductor';

export const executeTraductor = async (params: TraductorParams): Promise<void> => {
  try {
    const response = await axios.post(API_URL, params);
    console.log('Proceso ejecutado con éxito:', response.data);
  } catch (error) {
    console.error('Error ejecutando el traductor:', error);
    throw error;
  }
};
