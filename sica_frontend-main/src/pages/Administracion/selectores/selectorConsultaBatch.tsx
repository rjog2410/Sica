import { 
  saveBatchProcessMock,
  } from '../batchServiceMock';

import {
  saveBatchProcessApi as saveBatchProcessApi,
  } from '../servicios/consultaBacthService'; 
  
  const useMock = false; // Cambia a false para usar la API real, true para usar el mock
  
  export const _saveBatchProcess = useMock ? saveBatchProcessMock : saveBatchProcessApi;
  // Exportando las funciones correctamente
  export const saveBatchProcess = _saveBatchProcess;