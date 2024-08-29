import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { axiosInstance } from './axiosSetup';
import { useNotification } from '../providers/NotificationProvider';
import { Modulo } from '../types';

export interface CreateOrUpdateModuloPayload {
  mod_clave: string;
  mod_nombre: string;
  mod_prefijo: string;
  mod_fecha_inicio: string;
  mod_registros: number;
}

// Fetch function for módulos
const fetchModulos = async (): Promise<Modulo[]> => {
  const { data } = await axiosInstance.post('/catalogos/modulos');
  return data.data;
};

// Hook for fetching módulos
export const useFetchModulos = (options?: UseQueryOptions<Modulo[], Error>) => {
  const { notify } = useNotification();

  return useQuery<Modulo[], Error>({
    queryKey: ['modulos'],
    queryFn: async () => {
      try {
        const modulos = await fetchModulos();
        return modulos;
      } catch (error) {
        notify(`Error fetching modulos: ${(error as Error).message}`, 'error');
        throw error;
      }
    },
    ...options,
  });
};

// Create or update function for módulo
const createOrUpdateModulo = async (modulo: CreateOrUpdateModuloPayload): Promise<{ status: number; info: string }> => {
  const { data } = await axiosInstance.post('/catalogos/create/update/modulo', modulo);
  return data;
};

// Delete function for módulos
const deleteModulos = async (mod_claves: string[]): Promise<void> => {
  if (mod_claves.length === 1) {
    await axiosInstance.post('/catalogos/delete/modulo', { mod_clave: mod_claves[0] });
  } else {
    await axiosInstance.post('/catalogos/delete/modulo_all', { mod_claves });
  }
};

// Hook for mutating módulos
export const useMutateModulos = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  const createOrUpdateModuloMutation = useMutation({
    mutationFn: createOrUpdateModulo,
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.invalidateQueries({ queryKey: ['modulos'] });
        notify(`Modulo ${data.info} creado o actualizado exitosamente`, 'success');
      } else {
        notify(`Error creando o actualizando modulo: Status ${data.status}`, 'error');
      }
    },
    onError: (error: Error) => {
      notify(`Error creando o actualizando modulo: ${error.message}`, 'error');
    },
  });

  const deleteModulosMutation = useMutation({
    mutationFn: deleteModulos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modulos'] });
      notify('Modulos eliminados exitosamente', 'success');
    },
    onError: (error: Error) => {
      notify(`Error eliminando modulos: ${error.message}`, 'error');
    },
  });

  return {
    createOrUpdateModulo: createOrUpdateModuloMutation.mutateAsync,
    deleteModulos: deleteModulosMutation.mutateAsync,
  };
};
