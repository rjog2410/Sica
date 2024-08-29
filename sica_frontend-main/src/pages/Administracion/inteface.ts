export interface CargaSIFData {
    sistema: string;
    modulo: string;
    fechaConciliacion: string;
    fechaCarga: string;
    registros: number;
    tipo: string;
  }

  // src/types.ts
export interface ParametrosBatch {
    proceso: string;
    sistema: string;
    modulo: string;
    tipoConciliacion: string;
    borrarInformacion: string;
    fechaInicial: string;
    fechaFinal: string;
  }