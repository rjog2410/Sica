// Archivo: src/utils/loadPantallas.ts

import pantallasData from '../json/pantallas.json';  // Importación directa del archivo JSON
import { DataJson, Funcion, Pantalla } from '../types';

export const loadPantallasData = async (): Promise<DataJson> => {
    return pantallasData as DataJson;
};

/**
 * Obtiene los datos de una pantalla específica y sus funciones asociadas
 * @param nombrePantalla - El nombre de la pantalla a buscar en el JSON
 * @returns Un objeto que contiene la pantalla y sus funciones asociadas
 */
export const getPantallaData = async (nombrePantalla: string): Promise<{ pantalla: Pantalla | undefined; funciones: Funcion[] }> => {
    const data = await loadPantallasData();

    const pantalla = data.pantallas.find(p => p.nombre === nombrePantalla);

    if (!pantalla) {
        console.error(`Pantalla con nombre "${nombrePantalla}" no encontrada`);
        return { pantalla: undefined, funciones: [] };
    }

    const funciones = data.funciones.filter(f => pantalla.funciones.includes(f.id));

    return { pantalla, funciones };
};
