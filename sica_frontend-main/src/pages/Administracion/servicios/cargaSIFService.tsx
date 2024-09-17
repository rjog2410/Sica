import axios from 'axios';

// URL base de la API
const API_URL = 'http://localhost:8080/administracion';

    

export const fetchCargaSIFApi = async (filtros: any): Promise<any | null> => {
    try {
        console.log("antes enviando datos : ",filtros);
        var fechaCarga =filtros.fecha_carga !== '' ? filtros.fecha_carga?.split("-"): '';
        var fechaInformacion =filtros.fecha_informacion !== '' ? filtros.fecha_informacion?.split("-") : '';
        const newFiltro={
            fecha_carga: filtros.fecha_carga !== '' ? fechaCarga[2]+"/"+fechaCarga[1]+"/"+fechaCarga[0] :null,
            sistema: (!!filtros.sistema && filtros.sistema !== '' ? filtros.sistema : null),
            modulo: (!!filtros.modulo && filtros.modulo !== '' ? filtros.modulo : null),
            fecha_informacion: filtros.fecha_informacion !== '' ? fechaInformacion[2]+"/"+fechaInformacion[1]+"/"+fechaInformacion[0] : null,
            tipo_salmov: (!!filtros.tipo_salmov && filtros.tipo_salmov !== '' ? filtros.tipo_salmov : null),
          }

        console.log("enviand odatos : ",newFiltro);
      const response = await axios.post<{data: any[], status: number  }>(`${API_URL}/carga_sif`, newFiltro);
      console.log("response service: ",response)
      return response.data;
    } catch (error) {
      console.error(`Error fetching carga SIF from API ${filtros}:`, error);
      throw error;
    }
  };