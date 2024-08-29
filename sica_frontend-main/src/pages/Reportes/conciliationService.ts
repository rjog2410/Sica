import axios from "axios";
import { ReporteConciliacion, ReporteConciliacionFiltros } from "./interfaces";
  
  export const fetchReporteConciliacionSaldos = async (filtros: ReporteConciliacionFiltros): Promise<ReporteConciliacion[]> => {
    try {
      const response = await axios.post('/api/conciliacion/saldos', filtros);
      return response.data;
    } catch (error) {
      console.error('Error fetching report data from API', error);
      throw error;
    }
  };
  