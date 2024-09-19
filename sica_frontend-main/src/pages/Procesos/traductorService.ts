import axios from 'axios';
import { Modulo, Sistema, TraductorParams } from '../../types';

// Reemplaza con la URL real de tu API
const API_URL = 'http://localhost:8080/procesos/traductor/get';

const API_URL_MODULOS = 'http://localhost:8080/catalogos/modulos';

export const executeTraductor = async (params: TraductorParams): Promise<Modulo[]> => {
  var fecha =params.fecha_inicial?.split("-");
  params.fecha_inicial=fecha[2]+"/"+fecha[1]+"/"+fecha[0];

    var fecha =params.fecha_final?.split("-");
    params.fecha_final=fecha[2]+"/"+fecha[1]+"/"+fecha[0];

  try {
    const response = await axios.post(API_URL, params);
    
    console.log('Proceso ejecutado con éxito:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error ejecutando el traductor:', error);
    throw error;
  }
};


export const fetchSistemas = async () => {
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


