import axios from 'axios';
import {Cuenta, Formula, Regla} from '../../../types';

// Base URL de la API
const BASE_URL = 'http://localhost:8080/catalogos/cuentas_regla';

// Obtener el listado de sistemas
export const fetchSistemas = async (): Promise<{ clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/get_sistems_filter`);
    return response.data.data;
};

// Obtener el listado de módulos por sistema
export const fetchModulosBySistema = async (sistemaClave: string): Promise<{ mod_clave: string }[]> => {
    const response = await axios.post(`${BASE_URL}/get_modules_filter`, {cuc_mod_sis_clave: sistemaClave});
    return response.data.data;
};

// Obtener todas las cuentas
export const fetchAllCuentas = async (): Promise<Cuenta[]> => {
    const response = await axios.post(`${BASE_URL}/get_all`);
    return response.data.data;
};

// Obtener cuentas filtradas por sistema
export const fetchCuentasBySistema = async (sistemaClave: string): Promise<Cuenta[]> => {
    const response = await axios.post(`${BASE_URL}/get_by_cuc_mod_sis_clave`, {cuc_mod_sis_clave: sistemaClave});
    return response.data.data;
};

// Obtener cuentas filtradas por sistema y módulo
export const fetchCuentasBySistemaAndModulo = async (sistemaClave: string, moduloClave: string): Promise<Cuenta[]> => {
    const response = await axios.post(`${BASE_URL}/get_by_cuc_mod_clave`, {
        cuc_mod_sis_clave: sistemaClave,
        cuc_mod_clave: moduloClave,
    });
    return response.data.data;
};

// Crear una nueva cuenta
export const createCuenta = async (cuenta: Cuenta): Promise<number> => {
    const response = await axios.post(`${BASE_URL}/create`, cuenta);
    return response.data.info; // Retorna el ID creado
};

// Actualizar una cuenta
export const updateCuenta = async (cuenta: Cuenta & { id: number }): Promise<number> => {
    const response = await axios.post(`${BASE_URL}/update`, {
        cuc_clave: cuenta.id,  // ID de la cuenta
        cuc_mod_sis_clave: cuenta.clave_sistema,
        cuc_mod_clave: cuenta.clave_modulo,
        cuc_cuenta: cuenta.cuenta,
        cuc_scta1: cuenta.subcta1,
        cuc_scta2: cuenta.subcta2,
        cuc_scta3: cuenta.subcta3,
        cuc_scta4: cuenta.subcta4,
        cuc_scta5: cuenta.subcta5,
        cuc_scta6: cuenta.subcta6,
        cuc_scta7: cuenta.subcta7,
        cuc_tipo_ente: cuenta.tipo_ente,
        cuc_ente: cuenta.ente,
        cuc_consolida_ente: cuenta.consolida_ente,
        cuc_inc_saldo: cuenta.inc_saldo,
        cuc_inc_movs: cuenta.inc_movs,
    });
    return response.data.info; // Retorna el ID actualizado
};

// Eliminar una cuenta por ID
export const deleteCuenta = async (id: number): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/delete`, {id});
    return response.data;
};

// Eliminar múltiples cuentas por ID
export const deleteMultipleCuentas = async (ids: number[]): Promise<number[]> => {
    const response = await axios.post(`${BASE_URL}/delete_all`, {ids});
    return response.data; // Retorna los IDs eliminados
};

export const deleteFormula = async (formula: Formula): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/formulas/delete`,formula);
    return response.data;
};

//
export const deleteMultipleFormula = async (formulas: Formula[]): Promise<number[]> => {
    const response = await axios.post(`${BASE_URL}/formulas/delete_all`, formulas);
    return response.data; // Retorna los IDs eliminados
};

// Obtener reglas por cuenta
export const fetchReglas = async (cuentaId: number): Promise<Regla[]> => {
    const response = await axios.post(`${BASE_URL}/reglas/get`, {id: cuentaId});
    return response.data.data;
};
// Obtener formulas por cuenta
export const fetchFormulas = async (cuentaId: number): Promise<Formula[]> => {
    const response = await axios.post(`${BASE_URL}/formulas/get`, {id: cuentaId});
    return response.data.data;
};

// Crear una nueva regla
export const createRegla = async (regla: Regla, p0: boolean): Promise<any> => {
    if(p0){
        const response = await axios.post(`${BASE_URL}/reglas/create`, regla);
        return response;
    }else{
        const response =  await axios.post(`${BASE_URL}/reglas/update`, regla);
        return response;
    }
};

// Crear una nueva formula
export const createFormula = async (formula: Formula, p0: boolean): Promise<any> => {
    if(p0){
        const response = await axios.post(`${BASE_URL}/formulas/create`, formula);
        return response;
    }else{
        const response =  await axios.post(`${BASE_URL}/formulas/update`, formula);
        return response;
    }
};


// Actualizar una regla
export const updateRegla = async (regla: Regla): Promise<void> => {
    await axios.post(`${BASE_URL}/reglas/update`, regla);
};

// Eliminar una regla
export const deleteRegla = async (regla: Regla): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/reglas/delete`, {regla});
    return response;
};

// Eliminar múltiples reglas
export const deleteMultipleReglas = async (reglas: Regla[]): Promise<any> => {
    const response = await axios.post(`${BASE_URL}/reglas/delete_all`, reglas);
    return response.data;
};
