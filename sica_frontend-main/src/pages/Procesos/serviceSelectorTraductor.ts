import { executeTraductor as fetchAPI } from './traductorService';
import { sistemasMock, modulosMock, executeTraductorMock as mockExecute } from '../../mock/traductorMock';

const useMock = true; // Cambia a false para usar la API real

export const executeTraductor = useMock ? mockExecute : fetchAPI;
export { sistemasMock, modulosMock };

