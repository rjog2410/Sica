import axios from 'axios';
import { Sistema } from '../../../types';

// URL base de la API
const API_URL = 'http://localhost:8080/catalogos/sistemas';

export const fetchSistemas = async () => {

  try {
    const response = await axios.post<{ data: Sistema[], status: number }>(`${API_URL}/get_all`);
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching sistemas from API:', error);
    throw error;
  }
};

export const fetchSistemaByClave = async (sis_clave: string): Promise<Sistema | null> => {
  try {
    const response = await axios.post<{ data: Sistema, status: number }>(`${API_URL}/get_sistem`, { sis_clave });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching sistema with clave ${sis_clave}:`, error);
    throw error;
  }
};

export const deleteSistema = async (sis_clave: string): Promise<string | null> => {
  try {
    const response = await axios.post<{ message: string, status: number }>(`${API_URL}/delete`, { sis_clave });
    return response.data.message;
  } catch (error) {
    console.error(`Error deleting sistema with clave ${sis_clave}:`, error);
    throw error;
  }
};

export const deleteMultipleSistemas = async (sis_claves: string[]): Promise<string[] | null> => {
  try {
    const response = await axios.post<{ data: string[], status: number }>(`${API_URL}/delete_all`, { sis_claves });
    return response.data.data;
  } catch (error) {
    console.error('Error deleting multiple sistemas:', error);
    throw error;
  }
};

export const createOrUpdateSistema = async (sistema: Sistema, isUpdate: boolean = false): Promise<string | null> => {
  try {
    const endpoint = isUpdate ? 'update' : 'create';
    console.log(isUpdate);
    const response = await axios.post<{ message: string, status: number }>(`${API_URL}/${endpoint}`, sistema);
    return response.data;
  } catch (error) {
    console.error(`Error ${isUpdate ? 'updating' : 'creating'} sistema:`, error);
    throw error;
  }
};