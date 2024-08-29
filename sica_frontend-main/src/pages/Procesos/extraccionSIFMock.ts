export const sistemasMock = [
  { clave: "SISTEMA1", nombre: "Sistema 1" },
  { clave: "SISTEMA2", nombre: "Sistema 2" },
  { clave: "SISTEMA3", nombre: "Sistema 3" },
];

export const modulosMock = [
  { clave: "MODULO1", nombre: "Módulo 1" },
  { clave: "MODULO2", nombre: "Módulo 2" },
  { clave: "MODULO3", nombre: "Módulo 3" },
];

export const executeExtraccionSIFMock = async (params: any) => {
  console.log('Mock: Ejecutando extracción SIF con parámetros:', params);
  // Simulamos un retraso como si fuera una llamada a la API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Mock: Proceso ejecutado con éxito' });
    }, 1000);
  });
};
