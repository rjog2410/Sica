// interfaces.ts
export interface ReporteConciliacion {
  sistema: string;
  modulo: string;
  fecha: string;
  cuenta: string;
  ente: string;
  importe_sif: number;
  importe_operativo: number;
  diferencia: number;
  nivel_agrupacion: 'Cuenta' | 'Ente';
}

export interface ReporteConciliacionFiltros {
  sistema: string;
  modulo: string;
  fecha: string;
  agrupacion: 'Cuenta' | 'Ente';
}
