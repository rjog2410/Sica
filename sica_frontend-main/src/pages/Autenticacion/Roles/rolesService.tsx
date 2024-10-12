import axios from 'axios';
import { Rol } from '../../../types';

// URL base de la API para columnas
const API_URL_ROLES = 'http://localhost:8080/seguridad/roles';

// Adaptación de los datos recibidos de la API a la estructura interna
const adaptApiToInternalStructure = (data: any): Rol => ({
  id: data.id,
  nombre_rol: data.nombre_rol,
  pantallasId: data.pantallasId,
});

// Adaptación de la estructura interna para enviar a la API
const adaptInternalToApiStructure = (rol: Rol): any => ({
    id: rol.id,
    nombre: rol.nombre_rol,
    pantallasIds: rol.pantallasId,
});

export const fetchRoles = async (): Promise<Rol[]> => {
  try {
    const response = await axios.post<{ data: any[], status: number }>(`${API_URL_ROLES}/get`);
    console.log("respuesta get roles: ", response);
    return response.data.data.map(adaptApiToInternalStructure);
  } catch (error) {
    console.error('Error fetching roles from API:', error);
    throw error;
  }
};



export const fetchRolById = async (id: number): Promise<Rol> => {
  try {
    const response = await axios.post<{ data: any[], status: number }>(`${API_URL_ROLES}/get_by_id`, { id });
    return response.data.data.map(adaptApiToInternalStructure);
  } catch (error) {
    console.error(`Error fetching rol by id${id}:`, error);
    throw error;
  }
};


export const deleteRol = async (rol: Rol): Promise<string | null> => {
  try {
    const response = await axios.post<{ status: number; message: string }>(`${API_URL_ROLES}/delete`, adaptApiToInternalStructure(rol));
    return response.data.message;
  } catch (error) {
    console.error(`Error deleting rol:`, error);
    throw error;
  }
};

// services/columnasService.ts
export const deleteMultipleRoles = async (ids: number[]): Promise<any | null> => {
  try {
    const response = await axios.post<{ status: number; info: string }>(
      `${API_URL_ROLES}/delete_all`,{ids});
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
    console.error('Error deleting multiple roles:', error);
    throw error;
  }
};


export const createOrUpdateRol = async (rol: Rol, isUpdate: boolean = false): Promise<any | null> => {
  try {
    const endpoint = isUpdate ? 'update' : 'create';
    const data = isUpdate ? adaptInternalToApiStructure(rol) : {nombre: rol.nombre_rol, pantallasIds: rol.pantallasId};
    console.log(data)
    const response = await axios.post<{ status: number; message: string }>(`${API_URL_ROLES}/${endpoint}`, data);
    return response;
  } catch (error) {
    console.error(`Error ${isUpdate ? 'updating' : 'creating'} rol:`, error);
    throw error;
  }
};
