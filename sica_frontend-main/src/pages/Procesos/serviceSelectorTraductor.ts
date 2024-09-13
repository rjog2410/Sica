import { executeTraductor as fetchAPI } from './traductorService';
import { sistemasMock, modulosMock, executeTraductorMock as mockExecute } from '../../mock/traductorMock';

import {
    fetchModulos as fetchAPIModulos
  } from '../Catalogos/servicios/modulosService'; 

  
const useMock = false; // Cambia a false para usar la API real
const _fetchModulos = fetchAPIModulos;

export const executeTraductor = useMock ? mockExecute : fetchAPI;
export { sistemasMock, modulosMock };

export const fetchModulos = _fetchModulos;
