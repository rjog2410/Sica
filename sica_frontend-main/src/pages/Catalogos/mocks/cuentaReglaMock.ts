import { Cuenta, Regla } from "@/types";

// Datos mock
let cuentasMock: Cuenta[] = [
  {
    id: 1,
    clave_sistema: 'SIS001',
    clave_modulo: 'MOD001',
    cuenta: 'Cuenta001',
    clave_regla: 'Regla001',
    descripcion: 'Descripción de la cuenta 001',
    reg_cuc_clave: 123,
    reg_tit_mod_sis_clave: 'SIS001',
    reg_tit_mod_clave: 'MOD001',
    reg_tit_columna: 1,
    subcta1: null,
    subcta2: null,
    subcta3: null,
    subcta4: null,
    subcta5: null,
    subcta6: null,
    subcta7: null,
    tipo_ente: null,
    ente: null,
    tipo_conciliacion: 'E',
    consolida_ente: 'NO',
    inc_saldo: 'SI',
    inc_movs: 'SI',
  },
  {
    id: 2,
    clave_sistema: 'SIS002',
    clave_modulo: 'MOD002',
    cuenta: 'Cuenta002',
    clave_regla: 'Regla002',
    descripcion: 'Descripción de la cuenta 002',
    reg_cuc_clave: 456,
    reg_tit_mod_sis_clave: 'SIS002',
    reg_tit_mod_clave: 'MOD002',
    reg_tit_columna: 2,
    subcta1: 'Subcta1',
    subcta2: 'Subcta2',
    subcta3: null,
    subcta4: null,
    subcta5: null,
    subcta6: null,
    subcta7: null,
    tipo_ente: 1,
    ente: 'Ente002',
    tipo_conciliacion: 'S',
    consolida_ente: 'SI',
    inc_saldo: 'NO',
    inc_movs: 'SI',
  },
];

let reglasMock: Regla[] = [
  {
    id: 1,
    clave_regla: 'Regla001',
    descripcion: 'Descripción de la regla 001',
    reg_cuc_clave: 123,
    reg_tit_mod_sis_clave: 'SIS001',
    reg_tit_mod_clave: 'MOD001',
    reg_tit_columna: 1,
    reg_secuencia: 1,
    reg_operador: '=',
    reg_valor: '1000',
  },
  {
    id: 2,
    clave_regla: 'Regla002',
    descripcion: 'Descripción de la regla 002',
    reg_cuc_clave: 456,
    reg_tit_mod_sis_clave: 'SIS002',
    reg_tit_mod_clave: 'MOD002',
    reg_tit_columna: 2,
    reg_secuencia: 2,
    reg_operador: '>',
    reg_valor: '2000',
  },
];

// Mock para fetch de cuentas, reglas, y módulos

export const mockFetchAllCuentas = async (): Promise<Cuenta[]> => {
  return cuentasMock;
};

export const mockFetchReglas = async (): Promise<Regla[]> => {
  return reglasMock;
};

export const mockFetchModulosBySistema = async (sistema: string): Promise<string[]> => {
  const modulos = cuentasMock
    .filter(cuenta => cuenta.clave_sistema === sistema)
    .map(cuenta => cuenta.clave_modulo);
  return Array.from(new Set(modulos)); // Devuelve los módulos únicos para un sistema dado
};

export const mockFetchCuentasBySistema = async (sistema: string): Promise<Cuenta[]> => {
  return cuentasMock.filter(cuenta => cuenta.clave_sistema === sistema);
};

export const mockFetchCuentasBySistemaAndModulo = async (sistema: string, modulo: string): Promise<Cuenta[]> => {
  return cuentasMock.filter(
    cuenta => cuenta.clave_sistema === sistema && cuenta.clave_modulo === modulo
  );
};

export const mockCreateOrUpdateCuentaRegla = async (cuentaRegla: Cuenta): Promise<Cuenta> => {
  if (cuentaRegla.id) {
    const index = cuentasMock.findIndex(c => c.id === cuentaRegla.id);
    if (index !== -1) {
      cuentasMock[index] = cuentaRegla;
    }
  } else {
    cuentaRegla.id = cuentasMock.length + 1;
    cuentasMock.push(cuentaRegla);
  }
  return cuentaRegla;
};

export const mockDeleteCuentaRegla = async (id: number): Promise<void> => {
  cuentasMock = cuentasMock.filter(c => c.id !== id);
};

export const mockDeleteMultipleCuentasRegla = async (ids: number[]): Promise<void> => {
  cuentasMock = cuentasMock.filter(c => !ids.includes(c.id!));
};

export const mockCreateOrUpdateRegla = async (regla: Regla): Promise<Regla> => {
  if (regla.id) {
    const index = reglasMock.findIndex(r => r.id === regla.id);
    if (index !== -1) {
      reglasMock[index] = regla;
    }
  } else {
    regla.id = reglasMock.length + 1;
    reglasMock.push(regla);
  }
  return regla;
};

export const mockDeleteRegla = async (id: number): Promise<void> => {
  reglasMock = reglasMock.filter(r => r.id !== id);
};

export const mockDeleteMultipleReglas = async (ids: number[]): Promise<void> => {
  reglasMock = reglasMock.filter(r => !ids.includes(r.id));
};
