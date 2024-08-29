import { Columna } from '../../../types';

export const mockFetchColumnas = async (): Promise<Columna[]> => {
  return [
    {
      numero_columna: 1,
      titulo: 'MONEDA',
      clave_sistema: 'SIDECA',
      clave_modulo: 'FORWARD'
    },
    {
      numero_columna: 2,
      titulo: 'TIPO ENTE',
      clave_sistema: 'SIDECA',
      clave_modulo: 'FORWARD'
    }
  ];
};

export const mockFetchColumnaByNumero = async (numero_columna: number): Promise<Columna | undefined> => {
  const columnas = await mockFetchColumnas();
  return columnas.find(col => col.numero_columna === numero_columna);
};

export const mockDeleteColumna = async (columna: Columna): Promise<{ status: number; message: string }> => {
  console.log(`Columna con número ${columna.numero_columna} eliminada (mock).`);
  return { status: 200, message: 'OK' };
};

export const mockDeleteMultipleColumnas = async (columnas: Columna[]): Promise<{ status: number; message: string }> => {
  console.log(`Columnas eliminadas (mock):`, columnas);
  return { status: 200, message: 'OK' };
};

export const mockCreateOrUpdateColumna = async (columna: Columna, isUpdate: boolean = false): Promise<{ status: number; message: string }> => {
  console.log(`${isUpdate ? 'Actualizando' : 'Creando'} columna (mock):`, columna);
  return { status: 200, message: 'OK' };
};
