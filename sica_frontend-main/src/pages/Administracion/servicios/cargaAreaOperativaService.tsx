import axios from 'axios';
const { protocol, hostname, port } = window.location;
// URL base de la API
// const API_URL = process.env.BASE_API_URL;
const API_URL = process.env.ENVIROMENT === 'LOCAL' ? process.env.BASE_API_URL : `${protocol}//${hostname}${port ? `:${port}` : ''}`;
// URL base de la API
// const API_URL = 'http://localhost:8080/administracion';



export const fetchCargaAreaOperativaApi = async (filtros: any, token : string | null): Promise<any | null> => {
  try {
    var fechaCarga = filtros.fecha_carga !== '' ? filtros.fecha_carga?.split("-") : '';
    var fechaOperativa = filtros.fecha_operativa !== '' ? filtros.fecha_operativa?.split("-") : '';
    const newFiltro = {
      fecha_carga: filtros.fecha_carga !== '' ? fechaCarga[2] + "/" + fechaCarga[1] + "/" + fechaCarga[0] : null,
      sistema: (!!filtros.sistema && filtros.sistema !== '' ? filtros.sistema : null),
      modulo: (!!filtros.modulo && filtros.modulo !== '' ? filtros.modulo : null),
      fecha_informacion: filtros.fecha_operativa !== '' ? fechaOperativa[2] + "/" + fechaOperativa[1] + "/" + fechaOperativa[0] : null,
      tipo_salmov: (!!filtros.tipoSalMov && filtros.tipoSalMov !== '' ? filtros.tipoSalMov : null),
    }
    const response = await axios.post<{ data: any[], status: number }>(`${API_URL}/administracion/carga_operativa`, newFiltro, {
      headers: {
        'Authorization': `Bearer ${token}`,  
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};