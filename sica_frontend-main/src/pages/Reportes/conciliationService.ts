import axios from "axios";
import { ReporteConciliacion, ReporteConciliacionFiltros } from "./interfaces";
import { ConciliacionCuenta, ConciliacionCuentaDetalle } from "@/types.ts";
const { protocol, hostname, port } = window.location;
// const BASE_URL = 'http://localhost:8080';
const BASE_URL = process.env.ENVIROMENT === 'LOCAL' ? process.env.BASE_API_URL : `${protocol}//${hostname}${port ? `:${port}` : ''}`;
export const fetchReporteConciliacionSaldos = async (filtros: ReporteConciliacionFiltros,token : string | null): Promise<ReporteConciliacion[]> => {
    try {
        const tempDate = filtros?.fecha_informacion?.split('-')
        const temp = {
            ...filtros,
            fecha_informacion: `${tempDate[2]}/${tempDate[1]}/${tempDate[0]}`,
            moneda: filtros?.moneda * 1,
            oficina: filtros?.oficina * 1
        }
        const response = await axios.post(`${BASE_URL}/consultas/conciliacion_saldos/get_data`, temp, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching report data from API', error);
        throw error;
    }
};

// Obtener el listado de sistemas
export const fetchSistemas = async (token : string | null): Promise<{ clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/catalogos/sistemas/get_all`, null, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data.data;
};

export const fetchModulosBySistema = async (sistemaClave: string,token : string | null): Promise<{ mod_clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/get_modules_filter`, { cuc_mod_sis_clave: sistemaClave }, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data.data;
};

// Obtener el listado de monedas
export const fetchMonedas = async (token : string | null): Promise<{ clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/consultas/catalogos/monedas`, null, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data.data;
};

// Obtener el listado de oficinas
export const fetchOficinas = async (token : string | null): Promise<{ clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/consultas/catalogos/oficinas`, null, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data.data;
};

// Obtener el listado de oficinas
export const fetchDetailConcilia = async (searchParams: ConciliacionCuentaDetalle,token : string | null): Promise<{ clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/consultas/conciliacion_saldos/get_detail`, searchParams,{
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response.data.data;
};
