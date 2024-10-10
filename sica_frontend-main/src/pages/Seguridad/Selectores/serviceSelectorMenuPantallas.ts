
  import {
    fetchSistemas as fetchAPI,
    fetchSistemaByClave as fetchAPIByClave,
    deleteSistema as deleteAPISistema,
    deleteMultipleSistemas as deleteAPIMultipleSistemas,
    createOrUpdateSistema as createOrUpdateAPISistema
  } from '../Servicios/menuPantallasService';
  
  const useMock = false; // Cambia a false para usar la API real, true para usar el mock
  
  // Evitar referencias circulares usando variables intermedias
  const _fetchSistemas = useMock ? mockFetchSistemas : fetchAPI;
  const _fetchSistemaByClave = useMock ? mockFetchSistemaByClave : fetchAPIByClave;
  const _deleteSistema = useMock ? mockDeleteSistema : deleteAPISistema;
  const _deleteMultipleSistemas = useMock ? mockDeleteMultipleSistemas : deleteAPIMultipleSistemas;
  const _createOrUpdateSistema = useMock ? mockCreateOrUpdateSistema : createOrUpdateAPISistema;
  
  // Exportando las funciones correctamente
  export const fetchSistemas = _fetchSistemas;
  export const fetchSistemaByClave = _fetchSistemaByClave;
  export const deleteSistema = _deleteSistema;
  export const deleteMultipleSistemas = _deleteMultipleSistemas;
  export const createOrUpdateSistema = _createOrUpdateSistema;
  