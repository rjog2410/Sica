import {Pantalla, Rol, Usuario} from "@/types.ts";
import axios from "axios";

const API_URL_USUARIOS = 'http://localhost:8080/seguridad/usuarios/';
const API_URL_PANTALLAS = 'http://localhost:8080/seguridad/pantallas/';
const API_URL_ROL = 'http://localhost:8080/seguridad/roles/';

export const fetchUsuarios = async (): Promise<Usuario[]> => {
    try {
        const response = await axios.post<Usuario[]>(`${API_URL_USUARIOS}get`);
        return response.data;
    } catch (error) {
        console.error('Error fetching usuarios from API:', error);
        throw error;
    }
};

export const fetchPantallas = async (): Promise<Pantalla[]> => {
    try {
        const response = await axios.post<Pantalla[]>(`${API_URL_PANTALLAS}get`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pantallas from API:', error);
        throw error;
    }
};

export const fetchRoles = async (): Promise<Rol[]> => {
    try {
        const response = await axios.post<Rol[]>(`${API_URL_ROL}get`);
        return response.data;
    } catch (error) {
        console.error('Error fetching roles from API:', error);
        throw error;
    }
};

export const fetchDelUsuarios = async (ids: number[]): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL_USUARIOS}delete_all`,{ids});
        return response.data;
    } catch (error) {
        console.error('Error removing usuarios from API:', error);
        throw error;
    }
};

export const deleteUsuario = async (id: number): Promise<any> => {
    const response = await axios.post(`${API_URL_USUARIOS}delete`, {id});
    return response.data;
};

export const fetchUsuarioPermisos = async (id: number): Promise<any> => {
    try {
        const response = await axios.post<any>(`${API_URL_USUARIOS}get_permissions`,{id});
        return response.data;
    } catch (error) {
        console.error('Error fetching usuarios from API:', error);
        throw error;
    }
};

export const fetchCrearUsuario = async (usuario: Usuario): Promise<any> => {
    try {
        const response = await axios.post<any>(`${API_URL_USUARIOS}create`,{...usuario});
        return response.data;
    } catch (error) {
        console.error('Error fetching usuarios from API:', error);
        throw error;
    }
};

export const fetchActUsuario = async (usuario: Usuario): Promise<any> => {
    try {
        const response = await axios.post<any>(`${API_URL_USUARIOS}update`,{...usuario});
        return response.data;
    } catch (error) {
        console.error('Error fetching usuarios from API:', error);
        throw error;
    }
};

export const fetchAssignUsuario = async (id_user: number, pantallas: number[]): Promise<any> => {
    try {
        const response = await axios.post<any>(`${API_URL_USUARIOS}assign_permissions`,{id_user,pantallas});
        return response.data;
    } catch (error) {
        console.error('Error fetching usuarios from API:', error);
        throw error;
    }
};