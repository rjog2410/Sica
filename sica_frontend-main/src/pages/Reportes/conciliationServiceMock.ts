import axios from 'axios';
import { ReporteConciliacion, ReporteConciliacionFiltros } from './interfaces';
import pdfMake from 'pdfmake/build/pdfmake';

const mockData: ReporteConciliacion[] = [
  {
    sistema: 'SIF',
    modulo: 'MOD1',
    fecha: '2024-08-01',
    cuenta: '1111-0000-0000-0000',
    ente: 'Ente1',
    importe_sif: 10000,
    importe_operativo: 9500,
    diferencia: 500,
    nivel_agrupacion: 'Cuenta',
  },
  {
    sistema: 'SIF',
    modulo: 'MOD2',
    fecha: '2024-08-02',
    cuenta: '2222-0000-0000-0000',
    ente: 'Ente2',
    importe_sif: 15000,
    importe_operativo: 14500,
    diferencia: 500,
    nivel_agrupacion: 'Ente',
  },
  {
    sistema: 'Sistema2',
    modulo: 'MOD3',
    fecha: '2024-08-03',
    cuenta: '3333-0000-0000-0000',
    ente: 'Ente3',
    importe_sif: 20000,
    importe_operativo: 19000,
    diferencia: 1000,
    nivel_agrupacion: 'Cuenta',
  },
  {
    sistema: 'Sistema2',
    modulo: 'MOD4',
    fecha: '2024-08-04',
    cuenta: '4444-0000-0000-0000',
    ente: 'Ente4',
    importe_sif: 25000,
    importe_operativo: 24000,
    diferencia: 1000,
    nivel_agrupacion: 'Ente',
  },
  {
    sistema: 'Sistema3',
    modulo: 'MOD5',
    fecha: '2024-08-05',
    cuenta: '5555-0000-0000-0000',
    ente: 'Ente5',
    importe_sif: 30000,
    importe_operativo: 29000,
    diferencia: 1000,
    nivel_agrupacion: 'Cuenta',
  },
  {
    sistema: 'Sistema3',
    modulo: 'MOD6',
    fecha: '2024-08-06',
    cuenta: '6666-0000-0000-0000',
    ente: 'Ente6',
    importe_sif: 35000,
    importe_operativo: 34000,
    diferencia: 1000,
    nivel_agrupacion: 'Ente',
  },
  {
    sistema: 'Sistema4',
    modulo: 'MOD7',
    fecha: '2024-08-07',
    cuenta: '7777-0000-0000-0000',
    ente: 'Ente7',
    importe_sif: 40000,
    importe_operativo: 39000,
    diferencia: 1000,
    nivel_agrupacion: 'Cuenta',
  },
  {
    sistema: 'Sistema4',
    modulo: 'MOD8',
    fecha: '2024-08-08',
    cuenta: '8888-0000-0000-0000',
    ente: 'Ente8',
    importe_sif: 45000,
    importe_operativo: 44000,
    diferencia: 1000,
    nivel_agrupacion: 'Ente',
  },
  // Agrega más datos simulados si es necesario...
];

const API_URL = 'http://localhost:8080/reportes/reporte';

export const fetchReporteConciliacionSaldos = async (
  filtros: ReporteConciliacionFiltros
): Promise<ReporteConciliacion[]> => {

console.log(filtros)
  try {
    /*const response = await axios.post(API_URL, params);*/
    const response = await axios.post<{ data: any[], status: number }>(`${API_URL}`,filtros);

    console.log('Proceso ejecutado con éxito:', response.data);

    pdfMake.createPdf(response.data).download("exporta.pdf");

  } catch (error) {
    console.error('Error ejecutando la extracción SIF:', error);
    throw error; // Esto permite capturar el error en la UI y manejarlo apropiadamente
  }
  


};

export const getDistinctValues = async (key: keyof ReporteConciliacion): Promise<string[]> => {
  const values = Array.from(new Set(mockData.map(item => item[key] as string)));
  return ['TODOS', ...values];
};
