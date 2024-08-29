import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../api/axiosSetup';
import { useNotification } from '../providers/NotificationProvider';

// Interfaz para la carga útil de creación de un sistema
interface CreateSistemaPayload {
  sis_clave: string;  // Clave del sistema, alfanumérico, longitud máxima: 100, obligatorio
  sis_nombre?: string;  // Nombre del sistema, alfanumérico, longitud máxima: 100, opcional
}

// Interfaz para la carga útil de actualización de un sistema
interface UpdateSistemaPayload {
  sis_clave: string;  // Clave del sistema, alfanumérico, longitud máxima: 100, obligatorio
  sis_nombre?: string;  // Nombre del sistema, alfanumérico, longitud máxima: 100, opcional
}

// Interfaz del sistema
interface Sistema {
  sis_clave: string;  // Clave del sistema, alfanumérico, longitud máxima: 100, obligatorio
  sis_nombre?: string;  // Nombre del sistema, alfanumérico, longitud máxima: 100, opcional
}

// Función para crear un sistema
const createSistema = async (sistema: CreateSistemaPayload): Promise<Sistema> => {
  const { data } = await axiosInstance.post('/sistemas', sistema);
  return data;
};

// Función para actualizar un sistema
const updateSistema = async (sistema: UpdateSistemaPayload): Promise<Sistema> => {
  const { data } = await axiosInstance.put(`/sistemas/${sistema.sis_clave}`, sistema);
  return data;
};

// Función para eliminar un sistema
const deleteSistema = async (sis_clave: string): Promise<void> => {
  await axiosInstance.delete(`/sistemas/${sis_clave}`);
};

// Hook personalizado para las mutaciones de sistema
export const useMutateSistema = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  // Mutación para crear un sistema
  const createSistemaMutation = useMutation<Sistema, Error, CreateSistemaPayload>({
    mutationFn: createSistema,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sistemas'] });
      notify('Sistema creado exitosamente', 'success');
    },
    onError: (error: Error) => {
      notify(`Error creando sistema: ${error.message}`, 'error');
    },
  });

  // Mutación para actualizar un sistema
  const updateSistemaMutation = useMutation<Sistema, Error, UpdateSistemaPayload>({
    mutationFn: updateSistema,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sistemas'] });
      notify('Sistema actualizado exitosamente', 'success');
    },
    onError: (error: Error) => {
      notify(`Error actualizando sistema: ${error.message}`, 'error');
    },
  });

  // Mutación para eliminar un sistema
  const deleteSistemaMutation = useMutation<void, Error, string>({
    mutationFn: deleteSistema,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sistemas'] });
      notify('Sistema eliminado exitosamente', 'success');
    },
    onError: (error: Error) => {
      notify(`Error eliminando sistema: ${error.message}`, 'error');
    },
  });

  return {
    createSistema: createSistemaMutation.mutate,
    updateSistema: updateSistemaMutation.mutate,
    deleteSistema: deleteSistemaMutation.mutate,
  };
};
