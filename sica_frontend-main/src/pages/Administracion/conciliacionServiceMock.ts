export const fetchCargaSIFData = async (filtros: any) => {
    // Aquí deberías hacer una llamada a la API para obtener los datos reales.
    // Por ahora, usaré un mock.
    console.log("filtros",filtros);
    
    return [
      {
        registrosCargados: 219,
        registrosConciliados: 148,
        fecha_informacion: '02/05/2023',
        mod_sis_clave: 'SIF',
        tipo_salmov: 'S',
        mod_clave: 'MOD1',
        fecha_carga: '03/05/2023',
      },
      {
        registrosCargados: 345,
        registrosConciliados: 327,
        fecha_informacion: '02/05/2023',
        mod_sis_clave: 'SIF',
        tipo_salmov: 'S',
        mod_clave: 'MOD2',
        fecha_carga: '03/05/2023',
      }
      // ... más datos
    ];
  };
  