import axios from 'axios';

// URL base de la API
const API_URL = 'http://localhost:8080/administracion';

    

export const fetchCargaAreaOperativaApi = async (filtros: any): Promise<any | null> => {
    try {
        console.log("antes enviandodatos : ",filtros);
        var fechaCarga =filtros.fecha_carga !== '' ? filtros.fecha_carga?.split("-"): '';
        var fechaOperativa =filtros.fecha_operativa !== '' ? filtros.fecha_operativa?.split("-") : '';
        const newFiltro={
            fecha_carga: filtros.fecha_carga !== '' ? fechaCarga[2]+"/"+fechaCarga[1]+"/"+fechaCarga[0] :null,
            sistema: filtros.sistema,
            modulo: filtros.modulo,
            fecha_informacion: filtros.fecha_operativa !== '' ? fechaOperativa[2]+"/"+fechaOperativa[1]+"/"+fechaOperativa[0] : null,
            tipo_salmov: filtros.tipoSalMov,
          }

        console.log("enviandodatos : ",newFiltro);
      const response = await axios.post<{data: any[], status: number  }>(`${API_URL}/carga_operativa`, newFiltro);
      console.log("response service: ",response)
      return response.data;
    } catch (error) {
      console.error(`Error fetching carga area operativa from API ${filtros}:`, error);
      throw error;
    }
  };