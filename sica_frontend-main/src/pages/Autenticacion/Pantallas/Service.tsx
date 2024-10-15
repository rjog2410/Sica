import {Menu, Pantallas} from "@/types.ts";
import axios from "axios";

const API_URL_PANTALLAS = 'http://localhost:8080/seguridad/pantallas/';
const API_URL_MENU = 'http://localhost:8080/seguridad/menus/';


export const getMenu = async (): Promise<Menu[]> => {
    try {
        const response = await axios.post<Menu[]>(`${API_URL_MENU}get`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pantallas from API:', error);
        throw error;
    }
};


export const fetchPantallas = async (): Promise<Pantallas[]> => {
    try {
        const response = await axios.post<Pantallas[]>(`${API_URL_PANTALLAS}get`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pantallas from API:', error);
        throw error;
    }
};


export const fetchDelPantallas = async (ids: number[]): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL_PANTALLAS}delete_all`,{ids});
        return response.data;
    } catch (error) {
        console.error('Error removing Pantallas from API:', error);
        throw error;
    }
};

export const deletePantalla = async (id: number): Promise<any> => {
    const response = await axios.post(`${API_URL_PANTALLAS}delete`, {id});
    return response.data;
};


export const fetchActPantalla = async (Pantalla: Pantallas): Promise<any> => {
    try {
        Pantalla.nombre=Pantalla.nombre_pantalla
        const response = await axios.post<any>(`${API_URL_PANTALLAS}update`,{...Pantalla});
        return response.data;
    } catch (error) {
        console.error('Error fetching Pantallas from API:', error);
        throw error;
    }
};

export const fetchCrearPantalla = async (Pantallas: Pantallas): Promise<any> => {
    try {
        console.log(Pantallas)
        Pantallas.nombre=Pantallas.nombre_pantalla
        const response = await axios.post<any>(`${API_URL_PANTALLAS}create`,{...Pantallas});
        return response.data;
    } catch (error) {
        console.error('Error fetching Pantallas from API:', error);
        throw error;
    }
};
