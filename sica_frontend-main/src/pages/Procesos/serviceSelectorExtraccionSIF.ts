import { executeExtraccionSIF as fetchAPI } from './extraccionSIFService';
import { sistemasMock, modulosMock, executeExtraccionSIFMock as mockExecute } from '../../mock/extraccionSIFMock';

const useMock = true; // Cambia a false para usar la API real

export const executeExtraccionSIF = useMock ? mockExecute : fetchAPI;
export { sistemasMock, modulosMock };
