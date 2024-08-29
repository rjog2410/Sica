export const fetchSistemas = async (): Promise<{ label: string; value: string }[]> => {
  // Aquí deberías hacer una llamada a la API real
  // Este es un mock por ahora
  return [
    { label: 'SIF', value: 'SIF' },
    { label: 'Sistema2', value: 'Sistema2' }
  ];
};

export const fetchModulos = async (sistema: string): Promise<{ label: string; value: string }[]> => {
  // Aquí deberías hacer una llamada a la API real
  // Este es un mock por ahora
  return [
    { label: 'MOD1', value: 'MOD1' },
    { label: 'MOD2', value: 'MOD2' }
  ];
};

export const saveBatchProcess = async (data: any): Promise<{ success: boolean }> => {
  // Aquí deberías hacer una llamada a la API real para guardar el proceso batch
  // Este es un mock por ahora
  return { success: true };
};