import axios from 'axios';
import {Modulo, Sistema,ModuloO} from '../../../types';
import { useState } from 'react';

// URL base de la API para módulos
const API_URL_MODULOS = 'http://localhost:8080/catalogos/modulos';


export const fetchSistemas = async () => {
console.log("Trae los sistemas")
  try {
    const response = await axios.post<{ data: Sistema[], status: number }>(`${API_URL_MODULOS}/get_all`);
    console.log(response.data)
    return response.data.data;
  } catch (error) {
    console.error('Error fetching sistemas from API:', error);
    throw error;
  }
};

export const fetchModulos = async (): Promise<Modulo[]> => {
  try {
    const response = await axios.post<{ data: Modulo[], status: number }>(`${API_URL_MODULOS}/get_all`);
    return response.data.data; // Obtenemos el array dentro de "data"
  } catch (error) {
    console.error('Error fetching modulos from API:', error);
    throw error;
  }
};

export const fetchModuloByClave = async (mod_sis_clave: string | undefined): Promise<Modulo[]> => {
  try {
    const response = await axios.post<{ data: Modulo[], status: number }>(`${API_URL_MODULOS}/get_module`, { mod_sis_clave });
    return response.data.data; 
  } catch (error) {
    console.error(`Error fetching modulos with clave ${mod_sis_clave}:`, error);
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

    console.log(modulo.clave_sistema)
    const newModulo={
      mod_sis_clave: modulo.clave_sistema,
      mod_clave: modulo.clave_modulo,
      mod_nombre: modulo.nombre_modulo,
      mod_registros: modulo.num_registros,
      mod_fecha_carga: modulo.fecha_carga,
      mod_fecha_info: modulo.fecha_informacion,
      status_trans: modulo.status, // Se inicia como null
      tipo_trans: modulo.tipo_transaccion,           // Se inicia como null
      mod_agrup_rep: modulo.agrupacion_reportes
    }
    
    var fecha =modulo.fecha_informacion?.split("-");
    newModulo.mod_fecha_info=fecha[2]+"/"+fecha[1]+"/"+fecha[0];

    var fecha =modulo.fecha_carga?.split("-");
    newModulo.mod_fecha_carga=fecha[2]+"/"+fecha[1]+"/"+fecha[0];

    console.log(newModulo.mod_sis_clave)
    const response = await axios.post<{ status: number; message: string }>(`${API_URL_MODULOS}/${endpoint}`, newModulo);
    return response.data;
  } catch (error) {
    console.error(`Error ${isUpdate ? 'updating' : 'creating'} modulo:`, error);
    throw error;
  }
};
