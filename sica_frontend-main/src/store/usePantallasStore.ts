// store/usePantallasStore.ts
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface Caracteristica {
  longitud: number;
  tipo: string;
  formato: string;
  editable: boolean;
  obligatorio: boolean;
  origen: string;
}

interface Campo {
  nombre: string;
  descripcion: string;
  caracteristicas: Caracteristica;
}

interface Funcion {
  id: number;
  nombre: string;
  descripcion: string;
  columnas?: string[];
  filtros?: string[];
  campos?: Campo[];
}

interface Pantalla {
  id: number;
  nombre: string;
  descripcion: string;
  funciones: number[];
}

interface PantallasState {
  pantallas: Pantalla[];
  funciones: Funcion[];
  setPantallas: (pantallas: Pantalla[]) => void;
  setFunciones: (funciones: Funcion[]) => void;
}

const usePantallasStore = create<PantallasState>()(
  devtools(
    persist(
      (set) => ({
        pantallas: [],
        funciones: [],
        setPantallas: (pantallas) => set({ pantallas }),
        setFunciones: (funciones) => set({ funciones }),
      }),
      {
        name: 'pantallas-storage',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default usePantallasStore;
