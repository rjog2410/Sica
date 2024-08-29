import { 
    mockFetchColumnas,
    mockFetchColumnaByNumero,
    mockDeleteColumna,
    mockDeleteMultipleColumnas,
    mockCreateOrUpdateColumna
  } from '../mocks/columnasMock';  // Ajusta la ruta según tu estructura
  
  import {
    fetchColumnas as fetchAPIColumnas,
    deleteColumna as deleteAPIColumna,
    deleteMultipleColumnas as deleteAPIMultipleColumnas,
    createOrUpdateColumna as createOrUpdateAPIColumna
  } from '../servicios/columnasService';  // Ajusta la ruta según tu estructura
  
  const useMock = true; // Cambia a false para usar la API real, true para usar el mock
  
  export const fetchColumnas = useMock ? mockFetchColumnas : fetchAPIColumnas;
  export const fetchColumnaByNumero = useMock ? mockFetchColumnaByNumero : mockFetchColumnaByNumero;
  export const deleteColumna = useMock ? mockDeleteColumna : deleteAPIColumna;
  export const deleteMultipleColumnas = useMock ? mockDeleteMultipleColumnas : deleteAPIMultipleColumnas;
  export const createOrUpdateColumna = useMock ? mockCreateOrUpdateColumna : createOrUpdateAPIColumna;
  