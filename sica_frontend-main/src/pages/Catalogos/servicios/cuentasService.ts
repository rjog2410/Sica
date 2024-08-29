import axios from 'axios';
import { Cuenta } from '../../../types';

// Reemplaza con la URL real de la API para cuentas
const API_URL_CUENTAS = 'https://tu-api-url.com/cuentas';

export const fetchCuentas = async (): Promise<Cuenta[]> => {
  try {
    const response = await axios.get<Cuenta[]>(API_URL_CUENTAS);
    return response.data;
  } catch (error) {
    console.error('Error fetching cuentas from API:', error);
    throw error;
  }
};
