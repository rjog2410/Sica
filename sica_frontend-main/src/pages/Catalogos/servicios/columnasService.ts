import axios from 'axios';
import { Columna } from '../../../types';

// URL base de la API para columnas
const API_URL_COLUMNAS = 'http://localhost:8080/catalogos/columnas';

// Adaptación de los datos recibidos de la API a la estructura interna
const adaptApiToInternalStructure = (data: any): Columna => ({
  numero_columna: data.num_columnas,
  titulo: data.titulo,
  clave_sistema: data.mod_sis_clave,
  clave_modulo: data.mod_clave,
});

// Adaptación de la estructura interna para enviar a la API
const adaptInternalToApiStructure = (columna: Columna): any => ({
  tit_mod_sis_clave: columna.clave_sistema,
  tit_mod_clave: columna.clave_modulo,
  tit_columna: columna.numero_columna,
  tit_descripcion: columna.titulo,
});

export const fetchColumnas = async (): Promise<Columna[]> => {
  try {
    const response = await axios.post<{ data: any[], status: number }>(`${API_URL_COLUMNAS}/get_all_titulos`);
    return response.data.data.map(adaptApiToInternalStructure);
  } catch (error) {
    console.error('Error fetching columnas from API:', error);
    throw error;
  }
};



export const fetchColumnaBySistema = async (sis_clave: string): Promise<Columna[]> => {
  try {
    const response = await axios.post<{ data: any[], status: number }>(`${API_URL_COLUMNAS}/get_titulo_by_sis_clave`, { sis_clave });
    return response.data.data.map(adaptApiToInternalStructure);
  } catch (error) {
    console.error(`Error fetching columnas for sistema ${sis_clave}:`, error);
    throw error;
  }
};

export const fetchColumnaByModulo = async (sis_clave: string, mod_clave: string): Promise<Columna[]> => {
  try {
    const response = await axios.post<{ data: any[], status: number }>(`${API_URL_COLUMNAS}/get_titulo_by_mod_clave`, { sis_clave, mod_clave });
    return response.data.data.map(adaptApiToInternalStructure);
  } catch (error) {
    console.error(`Error fetching columnas for sistema ${sis_clave} and modulo ${mod_clave}:`, error);
    throw error;
  }
};

export const deleteColumna = async (columna: Columna): Promise<string | null> => {
  try {
    const response = await axios.post<{ status: number; message: string }>(`${API_URL_COLUMNAS}/delete_titulo`, adaptInternalToApiStructure(columna));
    return response.data.message;
  } catch (error) {
    console.error(`Error deleting columna:`, error);
    throw error;
  }
};

// services/columnasService.ts
export const deleteMultipleColumnas = async (columnas: Columna[]): Promise<any | null> => {
  try {
    const response = await axios.post<{ status: number; info: string }>(
      `${API_URL_COLUMNAS}/delete_all`,
      columnas.map(columna => ({
        tit_mod_sis_clave: columna.clave_sistema,
        tit_mod_clave: columna.clave_modulo,
        tit_columna: columna.numero_columna,
        tit_descripcion: columna.titulo,
      }))
    );
    console.log("resp elimiacion varias: ",response.data);

    return response.data;
   /*
    if (response.data.status !== 200) {
      throw new Error(response.data.message);
    }else{
      return response.data.message;
    }
      */
  } catch (error) {
    console.error('Error deleting multiple columnas:', error);
    throw error;
  }
};


export const createOrUpdateColumna = async (columna: Columna, isUpdate: boolean = false): Promise<any | null> => {
  try {
    const endpoint = isUpdate ? 'update' : 'create';
    const response = await axios.post<{ status: number; message: string }>(`${API_URL_COLUMNAS}/${endpoint}`, adaptInternalToApiStructure(columna));
    return response;
  } catch (error) {
    console.error(`Error ${isUpdate ? 'updating' : 'creating'} columna:`, error);
    throw error;
  }
};
