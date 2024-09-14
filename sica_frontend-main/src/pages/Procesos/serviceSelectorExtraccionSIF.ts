import { executeExtraccionSIF as fetchAPI } from './extraccionSIFService';
import { sistemasMock, modulosMock, executeExtraccionSIFMock as mockExecute } from '../../mock/extraccionSIFMock';

import {
    fetchModulos as fetchAPIModulos
  } from '../Catalogos/servicios/modulosService'; 

const useMock = false; // Cambia a false para usar la API real

const _fetchModulos = fetchAPIModulos;
export const executeExtraccionSIF = useMock ? mockExecute : fetchAPI;
export { sistemasMock, modulosMock };

export const fetchModulos = _fetchModulos;
