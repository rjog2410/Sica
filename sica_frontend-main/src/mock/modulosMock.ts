import { Modulo } from "../types";

// Datos simulados para los módulos
const mockModulos: Modulo[] = [
  { clave_sistema: 'FIDUCIA', clave_modulo: 'FIDUCIA', nombre_modulo: 'OPERACIONES FIDEICOMISOS', fecha_carga: null, num_registros: null, fecha_informacion: null, tipo_transaccion: null, status: null, agrupacion_reportes: null },
  { clave_sistema: 'GVAL', clave_modulo: 'PISO2', nombre_modulo: 'SEGUNDO PISO', fecha_carga: null, num_registros: null, fecha_informacion: null, tipo_transaccion: 'S', status: null, agrupacion_reportes: null },
  { clave_sistema: 'GVAL', clave_modulo: 'PISO1', nombre_modulo: 'PRIMER PISO', fecha_carga: null, num_registros: null, fecha_informacion: null, tipo_transaccion: 'S', status: null, agrupacion_reportes: null },
  { clave_sistema: 'SIPE', clave_modulo: 'INVPTMOS', nombre_modulo: 'INVPTMOS', fecha_carga: null, num_registros: null, fecha_informacion: '2012-09-18', tipo_transaccion: 'A', status: null, agrupacion_reportes: 'S' },
  { clave_sistema: 'TAS', clave_modulo: 'MEDI', nombre_modulo: 'MERCADO DE DINERO', fecha_carga: null, num_registros: null, fecha_informacion: '2012-07-03', tipo_transaccion: 'S', status: null, agrupacion_reportes: null },
];

// Simulación de la función fetchModulos
export const mockFetchModulos = async (): Promise<Modulo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockModulos);
    }, 1000); // Simula un retraso de 1 segundo
  });
};

// Simulación de la función fetchModuloByClave
export const mockFetchModuloByClave = async (mod_clave: string): Promise<Modulo | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const modulo = mockModulos.find(m => m.clave_modulo === mod_clave);
      resolve(modulo || null);
    }, 1000); // Simula un retraso de 1 segundo
  });
};

// Simulación de la función deleteModulo
export const mockDeleteModulo = async (mod_clave: string): Promise<string | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockModulos.findIndex(m => m.clave_modulo === mod_clave);
      if (index !== -1) {
        mockModulos.splice(index, 1); // Elimina el módulo del array simulado
        resolve(mod_clave);
      } else {
        resolve(null); // Retorna null si el módulo no fue encontrado
      }
    }, 500); // Simula un retraso de medio segundo
  });
};

// Simulación de la función deleteMultipleModulos
export const mockDeleteMultipleModulos = async (mod_claves: string[]): Promise<string[] | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const deletedClaves: string[] = [];
      mod_claves.forEach(clave => {
        const index = mockModulos.findIndex(m => m.clave_modulo === clave);
        if (index !== -1) {
          mockModulos.splice(index, 1); // Elimina el módulo del array simulado
          deletedClaves.push(clave);
        }
      });
      resolve(deletedClaves.length > 0 ? deletedClaves : null);
    }, 1000); // Simula un retraso de 1 segundo
  });
};

// Simulación de la función createOrUpdateModulo
export const mockCreateOrUpdateModulo = async (modulo: Modulo, isUpdate: boolean = false): Promise<string | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (isUpdate) {
        const index = mockModulos.findIndex(m => m.clave_modulo === modulo.clave_modulo);
        if (index !== -1) {
          mockModulos[index] = modulo; // Actualiza el módulo en el array simulado
          resolve(modulo.clave_modulo);
        } else {
          resolve(null); // Retorna null si el módulo no fue encontrado para actualizar
        }
      } else {
        mockModulos.push(modulo); // Agrega el nuevo módulo al array simulado
        resolve(modulo.clave_modulo);
      }
    }, 1000); // Simula un retraso de 1 segundo
  });
};
