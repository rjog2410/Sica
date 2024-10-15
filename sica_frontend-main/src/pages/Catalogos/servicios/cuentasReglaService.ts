import axios from 'axios';
import { Cuenta, Formula, Regla } from '../../../types';
const { protocol, hostname, port } = window.location;
// Base URL de la API
// const BASE_URL = 'http://localhost:8080/catalogos/cuentas_regla';
const BASE_URL = process.env.ENVIROMENT === 'LOCAL' ? process.env.BASE_API_URL : `${protocol}//${hostname}${port ? `:${port}` : ''}`;

// Obtener el listado de sistemas
export const fetchSistemas = async (token : string | null): Promise<{ clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/get_sistems_filter`, null, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data.data;
};

// Obtener el listado de módulos por sistema
export const fetchModulosBySistema = async (sistemaClave: string,token : string | null): Promise<{ mod_clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/get_modules_filter`, { cuc_mod_sis_clave: sistemaClave }, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data.data;
};

// Obtener todas las cuentas
export const fetchAllCuentas = async (token : string | null): Promise<Cuenta[]> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/get_all`, null, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data.data;
};

// Obtener cuentas filtradas por sistema
export const fetchCuentasBySistema = async (sistemaClave: string,token : string | null): Promise<Cuenta[]> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/get_by_cuc_mod_sis_clave`, { cuc_mod_sis_clave: sistemaClave }, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data.data;
};

// Obtener cuentas filtradas por sistema y módulo
export const fetchCuentasBySistemaAndModulo = async (sistemaClave: string, moduloClave: string,token : string | null): Promise<Cuenta[]> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/get_by_cuc_mod_clave`, {
        cuc_mod_sis_clave: sistemaClave,
        cuc_mod_clave: moduloClave,
    }, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data.data;
};

// Crear una nueva cuenta
export const createCuenta = async (cuenta: Cuenta,token : string | null): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/create`, cuenta, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response; // Retorna el ID creado
};

// Actualizar una cuenta
export const updateCuenta = async (cuenta: Cuenta,token : string | null): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/update`, {
        cuc_clave: cuenta.cuc_clave,  // ID de la cuenta
        cuc_mod_sis_clave: cuenta.cuc_mod_sis_clave,
        cuc_mod_clave: cuenta.cuc_mod_clave,
        cuc_cuenta: cuenta.cuc_cuenta,
        cuc_scta1: cuenta.cuc_scta1,
        cuc_scta2: cuenta.cuc_scta2,
        cuc_scta3: cuenta.cuc_scta3,
        cuc_scta4: cuenta.cuc_scta4,
        cuc_scta5: cuenta.cuc_scta5,
        cuc_scta6: cuenta.cuc_scta6,
        cuc_scta7: cuenta.cuc_scta7,
        cuc_tipo_ente: cuenta.cuc_tipo_ente,
        cuc_ente: cuenta.cuc_ente,
        cuc_consolida_ente: cuenta.cuc_consolida_ente,
        cuc_inc_saldo: cuenta.cuc_inc_saldo,
        cuc_inc_movs: cuenta.cuc_inc_movs,
    }, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response;
};

// Eliminar una cuenta por ID
export const deleteCuenta = async (id: number,token : string | null): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/delete`, { id }, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data;
};

// Eliminar múltiples cuentas por ID
export const deleteMultipleCuentas = async (ids: number[],token : string | null): Promise<number[]> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/delete_all`, { ids }, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data; // Retorna los IDs eliminados
};

export const deleteFormula = async (formula: Formula,token : string | null): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/formulas/delete`, formula, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data;
};

//
export const deleteMultipleFormula = async (formulas: Formula[],token : string | null): Promise<number[]> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/formulas/delete_all`, formulas, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data; // Retorna los IDs eliminados
};

// Obtener reglas por cuenta
export const fetchReglas = async (cuentaId: number,token : string | null): Promise<Regla[]> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/reglas/get`, { id: cuentaId }, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data.data;
};
// Obtener formulas por cuenta
export const fetchFormulas = async (cuentaId: number,token : string | null): Promise<Formula[]> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/formulas/get`, { id: cuentaId }, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data.data;
};

// Crear una nueva regla
export const createRegla = async (regla: Regla, p0: boolean,token : string | null): Promise<any> => {
    if (p0) {
        const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/reglas/create`, regla, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
            }
        });
        return response;
    } else {
        const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/reglas/update`, regla, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
            }
        });
        return response;
    }
};

// Crear una nueva formula
export const createFormula = async (formula: Formula, p0: boolean,token : string | null): Promise<any> => {
    if (p0) {
        const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/formulas/create`, formula, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
            }
        });
        return response;
    } else {
        const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/formulas/update`, formula, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
            }
        });
        return response;
    }
};


// Actualizar una regla
export const updateRegla = async (regla: Regla,token : string | null): Promise<void> => {
    await axios.post(`${BASE_URL}/catalogos/cuentas_regla/reglas/update`, regla, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
};

// Eliminar una regla
export const deleteRegla = async (regla: Regla,token : string | null): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/reglas/delete`, regla, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response;
};

// Eliminar múltiples reglas
export const deleteMultipleReglas = async (reglas: Regla[],token : string | null): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/catalogos/cuentas_regla/reglas/delete_all`, reglas, {
        headers: {
            'Authorization': `Bearer ${token}`,  // Agregar el JWT al header
        }
    });
    return response.data;
};
