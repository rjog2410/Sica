import axios from "axios";
import {ReporteConciliacion, ReporteConciliacionFiltros} from "./interfaces";
import {ConciliacionCuenta, ConciliacionCuentaDetalle} from "@/types.ts";

const BASE_URL = 'http://localhost:8080';

export const fetchReporteConciliacionSaldos = async (filtros: ReporteConciliacionFiltros): Promise<ReporteConciliacion[]> => {
    try {
        const tempDate = filtros?.fecha_informacion?.split('-')
        const temp = {
            ...filtros,
            fecha_informacion: `${tempDate[2]}/${tempDate[1]}/${tempDate[0]}`,
            moneda: filtros?.moneda * 1,
            oficina: filtros?.oficina * 1
        }
        const response = await axios.post(`${BASE_URL}/consultas/conciliacion_saldos/get_data`, temp);
        return response.data;
    } catch (error) {
        console.error('Error fetching report data from API', error);
        throw error;
    }
};

// Obtener el listado de sistemas
export const fetchSistemas = async (): Promise<{ clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/catalogos/sistemas/get_all`);
    return response.data.data;
};

export const fetchModulosBySistema = async (sistemaClave: string): Promise<{ mod_clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/get_modules_filter`, {cuc_mod_sis_clave: sistemaClave});
    return response.data.data;
};

// Obtener el listado de monedas
export const fetchMonedas = async (): Promise<{ clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/consultas/catalogos/monedas`);
    return response.data.data;
};

// Obtener el listado de oficinas
export const fetchOficinas = async (): Promise<{ clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/consultas/catalogos/oficinas`);
    return response.data.data;
};

// Obtener el listado de oficinas
export const fetchDetailConcilia = async (searchParams :ConciliacionCuentaDetalle): Promise<{ clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/consultas/conciliacion_saldos/get_detail`, searchParams);
    return response.data.data;
};
