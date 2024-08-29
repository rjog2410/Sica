import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { axiosInstance } from '../api/axiosSetup';
import { useNotification } from '../providers/NotificationProvider';
import axios from 'axios';

// Interfaz para la carga útil de creación/actualización de un módulo
interface ModuloPayload {
  mod_sis_clave: string;  
  mod_nombre?: string;  
  mod_clave: string;  
  mod_fecha_carga?: string;  
  mod_registros?: number;
}

// Interfaz del módulo
interface Modulo {
  mod_sis_clave: string;  
  mod_nombre?: string;  
  mod_clave: string;  
  mod_fecha_carga?: string;  
  mod_registros?: number;
}

// Función para crear o actualizar un módulo
const saveModulo = async (modulo: ModuloPayload): Promise<Modulo> => {
  const { data } = await axiosInstance.post('/catalogos/create/update/module', modulo);
  return data;
};

// Función para eliminar un módulo
const deleteModulo = async (mod_clave: string): Promise<void> => {
  await axiosInstance.post('/catalogos/delete/module', { mod_clave });
};

// Hook personalizado para las mutaciones de módulo
export const useMutateModulo = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  // Mutación para crear o actualizar un módulo
  const saveModuloMutation = useMutation<Modulo, Error, ModuloPayload>({
    mutationFn: saveModulo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modulos'] });
      notify('Módulo guardado exitosamente', 'success');
    },
    onError: (error: Error) => {
      notify(`Error guardando módulo: ${error.message}`, 'error');
    },
  });

  // Mutación para eliminar un módulo
  const deleteModuloMutation = useMutation<void, Error, string>({
    mutationFn: deleteModulo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modulos'] });
      notify('Módulo eliminado exitosamente', 'success');
    },
    onError: (error: Error) => {
      notify(`Error eliminando módulo: ${error.message}`, 'error');
    },
  });

  return {
    saveModulo: saveModuloMutation.mutate,
    deleteModulo: deleteModuloMutation.mutate,
  };
};

// Función para obtener la lista de módulos desde la API
const fetchModulos = async (): Promise<Modulo[]> => {
  try {
    const response = await axiosInstance.post<Modulo[]>('/catalogos/get_all_modules');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching modulos');
  }
};

// Hook personalizado para obtener la lista de módulos
export const useFetchModulos = () => {
  const { notify, notifyErrorWithStatus } = useNotification();

  return useQuery<Modulo[], Error>({
    queryKey: ['modulos'],
    queryFn: fetchModulos,
    onSuccess: () => {
      notify('Módulos cargados exitosamente', 'success');
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error) && error.response) {
        notifyErrorWithStatus(error.response.status, error.message);
      } else {
        notify('Error al cargar los módulos', 'error');
      }
    },
  } as UseQueryOptions<Modulo[], Error>);
};

// Función para obtener un módulo específico desde la API
const fetchModulo = async (mod_clave: string): Promise<Modulo> => {
  try {
    const response = await axiosInstance.post<Modulo>('/catalogos/get_module', { mod_clave });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching modulo');
  }
};

// Hook personalizado para obtener un módulo específico
export const useFetchModulo = (mod_clave: string) => {
  const { notify, notifyErrorWithStatus } = useNotification();

  return useQuery<Modulo, Error>({
    queryKey: ['modulo', mod_clave],
    queryFn: () => fetchModulo(mod_clave),
    onSuccess: () => {
      notify('Módulo cargado exitosamente', 'success');
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error) && error.response) {
        notifyErrorWithStatus(error.response.status, error.message);
      } else {
        notify('Error al cargar el módulo', 'error');
      }
    },
  } as UseQueryOptions<Modulo, Error>);
};
