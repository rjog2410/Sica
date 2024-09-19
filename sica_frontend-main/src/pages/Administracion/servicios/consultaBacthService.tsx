import axios from 'axios';

// URL base de la API
const API_URL = 'http://localhost:8080/administracion';

    

export const saveBatchProcessApi = async (filtros: any): Promise<any | null> => {
    try {
        console.log("antes enviando datos : ",filtros);

        
        var fechaInicio =filtros.fecha_ini !== '' ? filtros.fecha_ini?.split("-"): '';
        var fechaFin =filtros.fecha_fin !== '' ? filtros.fecha_fin?.split("-") : '';
        const newFiltro={
            proceso: (!!filtros.proceso && filtros.proceso !== '' ? filtros.proceso : null),
            sistema:(!!filtros.sistema && filtros.sistema !== '' ? filtros.sistema : null),
            modulo: (!!filtros.modulo && filtros.modulo !== '' ? filtros.modulo : null),
            tipo_informacion: (!!filtros.tipo_informacion && filtros.tipo_informacion !== '' ? filtros.tipo_informacion : null),
            borrar: (!!filtros.borrar && filtros.borrar !== '' ? filtros.borrar : null),
            fecha_ini: filtros.fecha_ini !== '' ? fechaInicio[2]+"/"+fechaInicio[1]+"/"+fechaInicio[0] :null,
            fecha_fin: filtros.fecha_fin !== '' ? fechaFin[2]+"/"+fechaFin[1]+"/"+fechaFin[0] : null,
            secuencia: 1,
          }

        console.log("enviando datos : ",newFiltro);
      const response = await axios.post<{data: any[], status: number  }>(`${API_URL}/batch`, newFiltro);
      console.log("response service: ",response)
      return response.data;
    } catch (error) {
      console.error(`Error consulta bacth from API ${filtros}:`, error);
      throw error;
    }
  };