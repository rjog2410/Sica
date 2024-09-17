// serviceSelector.ts
import { fetchReporteConciliacionSaldos as fetchMock } from './conciliationServiceMock';
// import { fetchReporteConciliacionSaldos as fetchAPI } from './conciliationService'; // Comenta si no hay API aún

const useMock = false; // Cambia a false para usar la API real

export const fetchReporteConciliacionSaldos = useMock ? fetchMock : fetchMock;
