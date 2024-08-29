import axios from 'axios';
import { Regla } from '../../../types';

// Reemplaza con la URL real de la API para reglas
const API_URL_REGLAS = 'https://tu-api-url.com/reglas';

export const fetchReglas = async (): Promise<Regla[]> => {
  try {
    const response = await axios.get<Regla[]>(API_URL_REGLAS);
    return response.data;
  } catch (error) {
    console.error('Error fetching reglas from API:', error);
    throw error;
  }
};
