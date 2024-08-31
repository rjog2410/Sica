import { 
    mockFetchModulos,
    mockDeleteModulo,
    mockDeleteMultipleModulos,
    mockCreateOrUpdateModulo
  } from '../../../mock/modulosMock'; 

  import {
    fetchModulos as fetchAPIModulos,
    fetchModuloByClave as fetchAPIModuloByClave,
    deleteModulo as deleteAPIModulo,
    deleteMultipleModulos as deleteAPIMultipleModulos,
    createOrUpdateModulo as createOrUpdateAPIModulo
  } from '../servicios/modulosService'; 
  
  const useMock = false; // Cambia a false para usar la API real, true para usar el mock
  
  const _fetchModulos = useMock ? mockFetchModulos : fetchAPIModulos;
  const _fetchModuloByClave = fetchAPIModuloByClave;
  const _deleteModulo = useMock ? mockDeleteModulo : deleteAPIModulo;
  const _deleteMultipleModulos = useMock ? mockDeleteMultipleModulos : deleteAPIMultipleModulos;
  const _createOrUpdateModulo = useMock ? mockCreateOrUpdateModulo : createOrUpdateAPIModulo;
  
  export const fetchModulos = _fetchModulos;
  export const fetchModuloByClave = _fetchModuloByClave;
  export const deleteModulo = _deleteModulo;
  export const deleteMultipleModulos = _deleteMultipleModulos;
  export const createOrUpdateModulo = _createOrUpdateModulo;
  