import axios from 'axios';
import { Modulo } from '../../../types';

// URL base de la API para módulos
const API_URL_MODULOS = 'http://localhost:8080/catalogos/modulos';

export const fetchModulos = async (): Promise<Modulo[]> => {
  try {
    const response = await axios.post<{ data: Modulo[], status: number }>(`${API_URL_MODULOS}/get_all`);
    return response.data.data; // Obtenemos el array dentro de "data"
  } catch (error) {
    console.error('Error fetching modulos from API:', error);
    throw error;
  }
};

export const fetchModuloByClave = async (mod_clave: string): Promise<Modulo | null> => {
  try {
    const response = await axios.post<{ data: Modulo[], status: number }>(`${API_URL_MODULOS}/get_module`, { mod_clave });
    return response.data.data.length ? response.data.data[0] : null; // Suponiendo que se devuelve una lista de módulos
  } catch (error) {
    console.error(`Error fetching modulo with clave ${mod_clave}:`, error);
    throw error;
  }
};

export const deleteModulo = async (mod_clave: string): Promise<string | null> => {
  try {
    const response = await axios.post<{ status: number; message: string }>(`${API_URL_MODULOS}/delete_module`, { mod_clave });
    return response.data.message;
  } catch (error) {
    console.error(`Error deleting modulo with clave ${mod_clave}:`, error);
    throw error;
  }
};

export const deleteMultipleModulos = async (mod_claves: string[]): Promise<string[] | null> => {
  try {
    const response = await axios.post<{ data: string[], status: number }>(`${API_URL_MODULOS}/delete_all`, { mod_claves });
    return response.data.data;
  } catch (error) {
    console.error('Error deleting multiple modulos:', error);
    throw error;
  }
};

export const createOrUpdateModulo = async (modulo: Modulo, isUpdate: boolean = false): Promise<string | null> => {
  try {
    const endpoint = isUpdate ? 'update' : 'create';
    const response = await axios.post<{ status: number; message: string }>(`${API_URL_MODULOS}/${endpoint}`, modulo);
    return response.data.message;
  } catch (error) {
    console.error(`Error ${isUpdate ? 'updating' : 'creating'} modulo:`, error);
    throw error;
  }
};
