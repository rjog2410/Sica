import { 
    fetchCargaSIFData,
  } from '../consultaSIFMock';

import {
    fetchCargaSIFApi as fetchCargaSIFApi,
  } from '../servicios/cargaSIFService'; 
  
  const useMock = false; // Cambia a false para usar la API real, true para usar el mock
  
  export const _fetchCargaSIF = useMock ? fetchCargaSIFData : fetchCargaSIFApi;
  // Exportando las funciones correctamente
  export const fetchCargaSIF = _fetchCargaSIF;