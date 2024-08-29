// src/mock/detalleMock.ts
export interface DetalleCuenta {
    tit_columna: string;
    tit_descripcion: string;
  }
  
  export const detalleMock: DetalleCuenta[] = [
    { tit_columna: "columna1", tit_descripcion: "Descripción 1" },
    { tit_columna: "columna2", tit_descripcion: "Descripción 2" },
    { tit_columna: "columna3", tit_descripcion: "Descripción 3" },
  ];
  