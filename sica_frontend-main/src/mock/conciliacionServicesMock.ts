// src/mock/conciliacionServicesMock.ts
import { DetalleCuentaConsultas } from '../types';

export const fetchTituloColumnas = async (sistema: string, modulo: string) => {
  console.log(`Fetching columns for Sistema: ${sistema}, Modulo: ${modulo}`);
  
  return [
    { tit_columna: 'cuenta', tit_descripcion: 'Cuenta Contable' },
    { tit_columna: 'tipo_ente', tit_descripcion: 'Tipo Ente' },
    { tit_columna: 'ente', tit_descripcion: 'Ente' },
    { tit_columna: 'importe_sif', tit_descripcion: 'Importe SIF' },
    { tit_columna: 'importe_area', tit_descripcion: 'Importe Área' },
    { tit_columna: 'diferencia', tit_descripcion: 'Diferencia' }
  ];
};

export const fetchDetallePorCuenta = async (filtros: any): Promise<DetalleCuentaConsultas[]> => {
  console.log(`Fetching details with filters: ${JSON.stringify(filtros)}`);

  return [
    {
      cuenta: filtros.cuenta || '12345',
      tipo_ente: filtros.tipo_ente || 'A',
      ente: filtros.ente || 'Ente1',
      importe_sif: 1000,
      importe_area: 950,
      diferencia: 50
    },
    // ... más datos si es necesario
  ];
};
