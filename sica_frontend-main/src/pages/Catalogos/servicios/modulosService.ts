import axios from 'axios';
import { Modulo, Sistema, ModuloO } from '../../../types';

const { protocol, hostname, port } = window.location;
// // URL base de la API para módulos
const API_URL_MODULOS = process.env.ENVIROMENT === 'LOCAL' ? process.env.BASE_API_URL : `${protocol}//${hostname}${port ? `:${port}` : ''}`;

export const fetchSistemas = async (token: string | null) => {
  try {
    const response = await axios.post<{ data: Sistema[], status: number }>(`${API_URL_MODULOS}/catalogos/modulos/get_all`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
      }
    });
    // console.log(response.data)
    return response.data.data;
  } catch (error) {
    console.error('Error fetching sistemas from API:', error);
    throw error;
  }
};

export const fetchModulos = async (token: string | null): Promise<Modulo[]> => {
  try {
    const response = await axios.post<{ data: Modulo[], status: number }>(`${API_URL_MODULOS}/catalogos/modulos/get_all`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
      }
    });
    return response.data.data; // Obtenemos el array dentro de "data"
  } catch (error) {
    // console.error('Error fetching modulos from API:', error);
    throw error;
  }
};

export const fetchModuloByClave = async (mod_sis_clave: string | undefined, token: string | null): Promise<Modulo[]> => {
  try {
    const response = await axios.post<{ data: Modulo[], status: number }>(`${API_URL_MODULOS}/catalogos/modulos/get_module`, { mod_sis_clave }, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
      }
    });
    return response.data.data;
  } catch (error) {
    // console.error(`Error fetching modulos with clave ${mod_sis_clave}:`, error);
    throw error;
  }
};

export const deleteModulo = async (mod_clave: string, token: string | null): Promise<string | null> => {
  try {
    const response = await axios.post<{ status: number; message: string }>(`${API_URL_MODULOS}/catalogos/modulos/delete_module`, { mod_clave }, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
      }
    });
    return response.data;
  } catch (error) {
    // console.error(`Error deleting modulo with clave ${mod_clave}:`, error);
    throw error;
  }
};

export const deleteMultipleModulos = async (mod_claves: string[], token: string | null): Promise<string[] | null> => {
  try {
    const response = await axios.post<{ data: string[], status: number }>(`${API_URL_MODULOS}/catalogos/modulos/delete_all`, { mod_claves }, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
      }
    });
    return response.data;
  } catch (error) {
    // console.error('Error deleting multiple modulos:', error);
    throw error;
  }
};

export const createOrUpdateModulo = async (modulo: Modulo, isUpdate: boolean = false, token: string | null): Promise<string | null> => {
  try {
    const endpoint = isUpdate ? 'update' : 'create';

    // console.log(modulo.clave_sistema)
    const newModulo = {
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

    if (modulo.fecha_informacion != null) {
      var fecha = modulo.fecha_informacion?.split("-");
      newModulo.mod_fecha_info = fecha[2] + "/" + fecha[1] + "/" + fecha[0];
    } else {
      newModulo.mod_fecha_info = "";
    }
    if (modulo.fecha_carga != null) {

      var fecha = modulo.fecha_carga?.split("-");
      newModulo.mod_fecha_carga = fecha[2] + "/" + fecha[1] + "/" + fecha[0];
    } else {
      newModulo.mod_fecha_carga = "";
    }
    // console.log(newModulo.mod_sis_clave)
    const response = await axios.post<{ status: number; message: string }>(`${API_URL_MODULOS}/catalogos/modulos/${endpoint}`, newModulo, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
      }
    });
    return response.data;
  } catch (error) {
    // console.error(`Error ${isUpdate ? 'updating' : 'creating'} modulo:`, error);
    throw error;
  }
};
