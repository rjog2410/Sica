import {Menu} from "@/types.ts";
import axios from "axios";

const API_URL_MENU = 'http://localhost:8080/seguridad/menus/';


export const fetchMenu = async (): Promise<Menu[]> => {
    try {
        const response = await axios.post<Menu[]>(`${API_URL_MENU}get`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pantallas from API:', error);
        throw error;
    }
};


export const fetchDelMenu = async (ids: number[]): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL_MENU}delete_all`,{ids});
        return response.data;
    } catch (error) {
        console.error('Error removing Menu from API:', error);
        throw error;
    }
};

export const deleteMenu = async (id: number): Promise<any> => {
    const response = await axios.post(`${API_URL_MENU}delete`, {id});
    return response.data;
};


export const fetchActMenu = async (Menu: Menu): Promise<any> => {
    try {
        const response = await axios.post<any>(`${API_URL_MENU}update`,{...Menu});
        return response.data;
    } catch (error) {
        console.error('Error fetching Menu from API:', error);
        throw error;
    }
};

export const fetchCrearMenu = async (Menu: Menu): Promise<any> => {
    try {
        const response = await axios.post<any>(`${API_URL_MENU}create`,{...Menu});
        return response.data;
    } catch (error) {
        console.error('Error fetching Menu from API:', error);
        throw error;
    }
};
