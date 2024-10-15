import axios from 'axios';
const { protocol, hostname, port } = window.location;
// URL base de la API
// const API_URL = process.env.BASE_API_URL;
const API_URL = process.env.ENVIROMENT === 'LOCAL' ? process.env.BASE_API_URL : `${protocol}//${hostname}${port ? `:${port}` : ''}`;

// URL base de la API
// const API_URL = 'http://localhost:8080/administracion';



export const saveBatchProcessApi = async (filtros: any, token : string | null): Promise<any | null> => {
  try {
    var fechaInicio = filtros.fecha_ini !== '' ? filtros.fecha_ini?.split("-") : '';
    var fechaFin = filtros.fecha_fin !== '' ? filtros.fecha_fin?.split("-") : '';
    let newFiltro = {};
    if (filtros.proceso === 'SICAP004') {
      newFiltro = {
        proceso: (!!filtros.proceso && filtros.proceso !== '' ? filtros.proceso : null),
        sistema: null,
        modulo: null,
        tipo_informacion: null,
        borrar: null,
        fecha_ini: filtros.fecha_ini !== '' ? fechaInicio[2] + "/" + fechaInicio[1] + "/" + fechaInicio[0] : null,
        fecha_fin: filtros.fecha_fin !== '' ? fechaFin[2] + "/" + fechaFin[1] + "/" + fechaFin[0] : null,
        secuencia: 1,
      }
    } else {
      newFiltro = {
        proceso: (!!filtros.proceso && filtros.proceso !== '' ? filtros.proceso : null),
        sistema: (!!filtros.sistema && filtros.sistema !== '' ? filtros.sistema : null),
        modulo: (!!filtros.modulo && filtros.modulo !== '' ? filtros.modulo : null),
        tipo_informacion: (!!filtros.tipo_informacion && filtros.tipo_informacion !== '' ? filtros.tipo_informacion : null),
        borrar: (!!filtros.borrar && filtros.borrar !== '' ? filtros.borrar : null),
        fecha_ini: filtros.fecha_ini !== '' ? fechaInicio[2] + "/" + fechaInicio[1] + "/" + fechaInicio[0] : null,
        fecha_fin: filtros.fecha_fin !== '' ? fechaFin[2] + "/" + fechaFin[1] + "/" + fechaFin[0] : null,
        secuencia: 1,
      }
    }


    const response = await axios.post<{ data: any[], status: number }>(`${API_URL}/administracion/batch`, newFiltro, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};