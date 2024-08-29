import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { axiosInstance } from './axiosSetup';
import { useNotification } from '../providers/NotificationProvider';
import { Sistema } from '../types';

// Actualizamos la interfaz para reflejar solo los campos necesarios
export interface CreateOrUpdateSistemaPayload {
  sis_clave: string;
  sis_nombre: string;
}

// Fetch function for sistemas
const fetchSistemas = async (): Promise<Sistema[]> => {
  const { data } = await axiosInstance.post('/catalogos/sistemas');
  return data.data;
};

// Hook for fetching sistemas
export const useFetchSistemas = (options?: UseQueryOptions<Sistema[], Error>) => {
  const { notify } = useNotification();

  return useQuery<Sistema[], Error>({
    queryKey: ['sistemas'],
    queryFn: async () => {
      try {
        const sistemas = await fetchSistemas();
        return sistemas;
      } catch (error) {
        notify(`Error fetching sistemas: ${(error as Error).message}`, 'error');
        throw error;
      }
    },
    ...options,
  });
};

// Create or update function for sistema
const createOrUpdateSistema = async (sistema: CreateOrUpdateSistemaPayload): Promise<{ status: number; info: string }> => {
  const { data } = await axiosInstance.post('/catalogos/create/update/sistem', sistema);
  return data;
};

// Delete function for sistemas
const deleteSistemas = async (sis_claves: string[]): Promise<void> => {
  if (sis_claves.length === 1) {
    await axiosInstance.post('/catalogos/delete/sistem', { sis_clave: sis_claves[0] });
  } else {
    await axiosInstance.post('/catalogos/delete/sistem_all', { sis_claves });
  }
};

// Hook for mutating sistemas
export const useMutateSistemas = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  const createOrUpdateSistemaMutation = useMutation({
    mutationFn: createOrUpdateSistema,
    onSuccess: (data) => {
      if (data.status === 200) {
        queryClient.invalidateQueries({ queryKey: ['sistemas'] });
        notify(`Sistema ${data.info} creado o actualizado exitosamente`, 'success');
      } else {
        notify(`Error creando o actualizando sistema: Status ${data.status}`, 'error');
      }
    },
    onError: (error: Error) => {
      notify(`Error creando o actualizando sistema: ${error.message}`, 'error');
    },
  });

  const deleteSistemasMutation = useMutation({
    mutationFn: deleteSistemas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sistemas'] });
      notify('Sistemas eliminados exitosamente', 'success');
    },
    onError: (error: Error) => {
      notify(`Error eliminando sistemas: ${error.message}`, 'error');
    },
  });

  return {
    createOrUpdateSistema: createOrUpdateSistemaMutation.mutateAsync,
    deleteSistemas: deleteSistemasMutation.mutateAsync,
  };
};
