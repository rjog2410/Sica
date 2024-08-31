import { mockFetchSistemas } from '@/mock/sistemasMock';
import {
  mockFetchAllCuentas,
  mockCreateOrUpdateCuentaRegla,
  mockDeleteCuentaRegla,
  mockDeleteMultipleCuentasRegla,
  mockFetchReglas,
  mockCreateOrUpdateRegla,
  mockDeleteRegla as mockDeleteReglaFunc,
  mockDeleteMultipleReglas,
  mockFetchModulosBySistema,
  mockFetchCuentasBySistema,
  mockFetchCuentasBySistemaAndModulo,
} from '@/pages/Catalogos/mocks/cuentaReglaMock';

import {
  fetchSistemas,
  fetchModulosBySistema,
  fetchAllCuentas,
  fetchCuentasBySistema,
  fetchCuentasBySistemaAndModulo,
  createCuenta,
  deleteCuenta,
  deleteMultipleCuentas,
  fetchReglas,
  createRegla,
  updateRegla,
  deleteRegla as realDeleteRegla,
  deleteMultipleReglas,
} from '@/pages/Catalogos/servicios/cuentasReglaService';

const useMock = false; // Cambia a false para usar la API real, true para usar el mock

export const getSistemas = useMock ? mockFetchSistemas : fetchSistemas;
export const getModulosBySistema = useMock
  ? mockFetchModulosBySistema
  : fetchModulosBySistema;
export const getAllCuentas = useMock ? mockFetchAllCuentas : fetchAllCuentas;
export const getCuentasBySistema = useMock
  ? mockFetchCuentasBySistema
  : fetchCuentasBySistema;
export const getCuentasBySistemaAndModulo = useMock
  ? mockFetchCuentasBySistemaAndModulo
  : fetchCuentasBySistemaAndModulo;
export const createOrUpdateCuentaRegla = useMock
  ? mockCreateOrUpdateCuentaRegla
  : createCuenta;
export const removeCuenta = useMock ? mockDeleteCuentaRegla : deleteCuenta;
export const removeMultipleCuentas = useMock
  ? mockDeleteMultipleCuentasRegla
  : deleteMultipleCuentas;
export const getReglas = useMock ? mockFetchReglas : fetchReglas;
export const createOrUpdateRegla = useMock
  ? mockCreateOrUpdateRegla
  : createRegla;
export const removeRegla = useMock ? mockDeleteReglaFunc : realDeleteRegla;
export const removeMultipleReglas = useMock
  ? mockDeleteMultipleReglas
  : deleteMultipleReglas;
export { updateRegla };
