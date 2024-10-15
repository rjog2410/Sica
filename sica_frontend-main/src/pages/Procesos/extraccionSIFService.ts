import axios from 'axios';
import { ExtraccionParams, Modulo, Sistema } from '../../types';
const { protocol, hostname, port } = window.location;
// Reemplaza con la URL real de tu API
const API_URL = process.env.ENVIROMENT === 'LOCAL' ? process.env.BASE_API_URL : `${protocol}//${hostname}${port ? `:${port}` : ''}`;
// const API_URL = 'http://localhost:8080/procesos/extractor_sif/get';
// const API_URL_MODULOS = 'http://localhost:8080/catalogos/modulos';
const API_URL_MODULOS = process.env.ENVIROMENT === 'LOCAL' ? process.env.BASE_API_URL : `${protocol}//${hostname}${port ? `:${port}` : ''}`;

export const executeExtraccionSIF = async (params: ExtraccionParams, token: string | null): Promise<Modulo[]> => {

  var fecha = params.fecha_inicial?.split("-");
  params.fecha_inicial = fecha[2] + "/" + fecha[1] + "/" + fecha[0];

  var fecha = params.fecha_final?.split("-");
  params.fecha_final = fecha[2] + "/" + fecha[1] + "/" + fecha[0];

  try {
    /*const response = await axios.post(API_URL, params);*/
    const response = await axios.post<{ data: any[], status: number }>(`${API_URL}/procesos/extractor_sif/get`, params, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    console.log('Proceso ejecutado con éxito:', response.data);
    return response.data;
  } catch (error) {
    throw error; // Esto permite capturar el error en la UI y manejarlo apropiadamente
  }
};


export const fetchSistemas = async (token : string | null) => {
  try {
    const response = await axios.post<{ data: Sistema[], status: number }>(`${API_URL_MODULOS}/catalogos/modulos/get_all`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchModulos = async (token : string | null): Promise<Modulo[]> => {
  try {
    const response = await axios.post<{ data: Modulo[], status: number }>(`${API_URL_MODULOS}/catalogos/modulos/get_all`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data.data; // Obtenemos el array dentro de "data"
  } catch (error) {
    throw error;
  }
};


