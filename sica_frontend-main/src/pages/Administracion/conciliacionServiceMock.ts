export const fetchCargaSIFData = async (filtros: any) => {
    // Aquí deberías hacer una llamada a la API para obtener los datos reales.
    // Por ahora, usaré un mock.
    console.log("filtros",filtros);
    
    return [
      {
        sistema: 'SIF',
        modulo: 'MOD1',
        fechaConciliacion: '2024-08-01',
        fechaCarga: '2024-08-02',
        registros: 120,
        tipo: 'S'
      },
      {
        sistema: 'SIF',
        modulo: 'MOD2',
        fechaConciliacion: '2024-08-01',
        fechaCarga: '2024-08-02',
        registros: 150,
        tipo: 'M'
      }
      // ... más datos
    ];
  };
  