import axios from 'axios';
import { ExtraccionParams } from '../../types';

// Reemplaza con la URL real de tu API
const API_URL = 'https://tu-api-url.com/extraccion-sif';

export const executeExtraccionSIF = async (params: ExtraccionParams): Promise<void> => {
  try {
    const response = await axios.post(API_URL, params);
    console.log('Proceso ejecutado con éxito:', response.data);
  } catch (error) {
    console.error('Error ejecutando la extracción SIF:', error);
    throw error; // Esto permite capturar el error en la UI y manejarlo apropiadamente
  }
};
