import axios from 'axios';
import { Sistema } from '../../../types';
// import useAuthStore from '@/store/authStore';
// const token = useAuthStore.getState().token;
const { protocol, hostname, port } = window.location;
// URL base de la API
// const API_URL = process.env.BASE_API_URL;
const API_URL = process.env.ENVIROMENT === 'LOCAL' ? process.env.BASE_API_URL : `${protocol}//${hostname}${port ? `:${port}` : ''}`;

export const fetchSistemas = async (token : string | null) => {

  try {
    const response = await axios.post<{ data: Sistema[], status: number }>(`${API_URL}/catalogos/sistemas/get_all`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
      }
    });
    return response?.data?.data;
  } catch (error) {
    // console.error('Error fetching sistemas from API:', error);
    throw error;
  }
};



export const fetchSistemaByClave = async (sis_clave: string,token : string | null): Promise<Sistema | null> => {
  try {
    const response = await axios.post<{ data: Sistema, status: number }>(`${API_URL}/catalogos/sistemas/get_sistem`, { sis_clave }, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
      }
    });
    return response.data.data;
  } catch (error) {
    // console.error(`Error fetching sistema with clave ${sis_clave}:`, error);
    throw error;
  }
};

export const deleteSistema = async (sis_clave: string,token : string | null): Promise<string | null> => {
  try {
    const response = await axios.post<{ message: string, status: number }>(`${API_URL}/catalogos/sistemas/delete`, { sis_clave }, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
      }
    });
    return response.data;
  } catch (error) {
    // console.error(`Error deleting sistema with clave ${sis_clave}:`, error);
    throw error;
  }
};

export const deleteMultipleSistemas = async (sis_claves: string[],token : string | null): Promise<string[] | null> => {
  try {
    const response = await axios.post<{ data: string[], status: number }>(`${API_URL}/catalogos/sistemas/delete_all`, { sis_claves }, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
      }
    });
    return response.data;
  } catch (error) {
    // console.error('Error deleting multiple sistemas:', error);
    throw error;
  }
};

export const createOrUpdateSistema = async (sistema: Sistema, isUpdate: boolean = false,token : string | null): Promise<string | null> => {
  try {
    const endpoint = isUpdate ? 'update' : 'create';
    const response = await axios.post<{ message: string, status: number }>(`${API_URL}/catalogos/sistemas/${endpoint}`, sistema, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};