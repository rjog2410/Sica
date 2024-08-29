// src/api/batchService.ts
export interface BatchProcessParams {
  sistema: string;
  modulo: string;
  tipoInformacion: string;
  borrarInformacion: string;
  fechaInicio: string;
  fechaFin: string;
}

export const fetchSistemas = async (): Promise<{ label: string; value: string }[]> => {
  // Implementación de la API o mock
  return [
    { label: 'Sistema 1', value: 'SIS1' },
    { label: 'Sistema 2', value: 'SIS2' },
  ];
};

export const fetchModulos = async (_sistema: string): Promise<{ label: string; value: string }[]> => {
  // Implementación de la API o mock
  return [
    { label: 'Módulo 1', value: 'MOD1' },
    { label: 'Módulo 2', value: 'MOD2' },
  ];
};

export const saveBatchProcess = async (params: BatchProcessParams): Promise<{ success: boolean }> => {
  try {
    // Implementación de la llamada a la API o mock
    console.log('Guardando proceso batch con los parámetros:', params);
    return { success: true };
  } catch (error) {
    console.error('Error al guardar el proceso batch:', error);
    return { success: false };
  }
};
