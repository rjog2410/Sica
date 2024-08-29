// src/services/aoService.ts
export const fetchCargaAOData = async (filtros: any) => {
    // Aquí deberías hacer una llamada a la API para obtener los datos reales.
    // Por ahora, usaré un mock.

    console.log("Filtros",filtros);
    
    return [
      {
        fechaCarga: '2024-08-01',
        sistema: 'SIF',
        modulo: 'MOD1',
        fechaOperativa: '2024-08-01',
        tipoConciliacion: 'S',
        registrosCargados: 1000,
        registrosConciliados: 950,
      },
      // ... otros datos
    ];
  };
  