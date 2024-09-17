export const fetchCargaSIFData = async (filtros: any) => {
    // Aquí deberías hacer una llamada a la API para obtener los datos reales.
    // Por ahora, usaré un mock.
    console.log("filtros",filtros);
    
    return {
      status: 200,
      data:[
        {
          RegistrosCargados: 10,
          sis_clave: 'TAS',
          fecha_conciliacion: '19/05/2004',
          mod_clave: 'CAMBIOS',
          fecha_carga: '20/05/2004',
          tipo_salmov: 'S',
        },
        {
          RegistrosCargados: 13,
          sis_clave: 'TAS',
          fecha_conciliacion: '20/05/2004',
          mod_clave: 'CAMBIOS',
          fecha_carga: '21/05/2004',
          tipo_salmov: 'M',
        }
        // ... más datos
      ]
    } ;
  };