import axios from 'axios';
import { ExtraccionParams, Modulo, Sistema } from '../../types';

// Reemplaza con la URL real de tu API

const API_URL = 'http://localhost:8080/procesos/extractor_sif/get';
const API_URL_MODULOS = 'http://localhost:8080/catalogos/modulos';

export const executeExtraccionSIF = async (params: ExtraccionParams): Promise<void> => {

  var fecha =params.fecha_inicial?.split("-");
  params.fecha_inicial=fecha[2]+"/"+fecha[1]+"/"+fecha[0];

    var fecha =params.fecha_final?.split("-");
    params.fecha_final=fecha[2]+"/"+fecha[1]+"/"+fecha[0];
    
  try {
    const response = await axios.post(API_URL, params);

    console.log('Proceso ejecutado con éxito:', response.data);
  } catch (error) {
    console.error('Error ejecutando la extracción SIF:', error);
    throw error; // Esto permite capturar el error en la UI y manejarlo apropiadamente
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


