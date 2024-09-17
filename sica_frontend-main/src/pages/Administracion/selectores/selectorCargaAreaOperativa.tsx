import { 
    fetchCargaAOData,
  } from '../../../mock/aoServiceMock';

import {
    fetchCargaAreaOperativaApi as fetchCargaAreaOperativaApi,
  } from '../servicios/cargaAreaOperativaService'; 
  
  const useMock = false; // Cambia a false para usar la API real, true para usar el mock
  
  export const _fetchCargaAreaOperativa = useMock ? fetchCargaAOData : fetchCargaAreaOperativaApi;
  // Exportando las funciones correctamente
  export const fetchCargaAreaOperativa = _fetchCargaAreaOperativa;