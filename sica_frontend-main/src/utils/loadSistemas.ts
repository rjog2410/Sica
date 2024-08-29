import { DataJson, Pantalla, Funcion, GenericItem } from '../types';

export const loadPantallasData = async (): Promise<DataJson> => {
    const response = await fetch('/json/pantallas.json');  // Ruta al archivo JSON
    if (!response.ok) {
        throw new Error('Error al cargar el archivo JSON');
    }
    const data: DataJson = await response.json();
    return data;
};

export const getSistemasData = async (): Promise<{ pantalla: Pantalla | undefined; funciones: Funcion[]; sistemas: GenericItem[] }> => {
    const data = await loadPantallasData();

    // Filtrar la pantalla "Catálogo de Sistemas"
    const pantalla = data.pantallas.find(p => p.nombre === "Catálogo de Sistemas");
    const funciones = pantalla ? data.funciones.filter(f => pantalla.funciones.includes(f.id)) : [];

    // Extraer opciones para el ComboBox del filtro "Sistema"
    const consultaFuncion = funciones.find(f => f.nombre === 'Consulta');
    const sistemas: GenericItem[] = consultaFuncion && consultaFuncion.filtros 
        ? consultaFuncion.filtros.map(filtro => ({ sis_clave: filtro })) 
        : [];

    return { pantalla, funciones, sistemas };
};
