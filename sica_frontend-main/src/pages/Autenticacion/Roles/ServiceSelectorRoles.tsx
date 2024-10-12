import { 
    mockFetchRoles,
    mockFetchRolById,
    mockDeleteRol,
    mockDeleteMultipleRoles,
    mockCreateOrUpdateRol
  } from '../../../mock/RolesMock';  
  
  import {
    fetchRoles as fetchAPIRoles,
    deleteRol as deleteAPIRol,
    deleteMultipleRoles as deleteAPIMultipleRoles,
    createOrUpdateRol as createOrUpdateAPIRol,
    fetchRolById as fetchAPIRolById,
  } from './rolesService';  // Ajusta la ruta según tu estructura
  
  const useMock = false; // Cambia a false para usar la API real, true para usar el mock
  
  export const fetchRoles = useMock ? mockFetchRoles : fetchAPIRoles;
  export const fetchRolsById = useMock ? mockFetchRolById : fetchAPIRolById;
  export const deleteRol = useMock ? mockDeleteRol : deleteAPIRol;
  export const deleteMultipleRoles = useMock ? mockDeleteMultipleRoles : deleteAPIMultipleRoles;
  export const createOrUpdateRol = useMock ? mockCreateOrUpdateRol : createOrUpdateAPIRol;
  