import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RouteConfig } from '../types';

// Función para obtener las rutas
const fetchRoutes = async (): Promise<RouteConfig[]> => {
  const response = await axios.get<{ routes: RouteConfig[] }>('http://127.0.0.1:8000/api/routes');
  return response.data.routes;
};

// Hook personalizado para cargar rutas usando react-query
export const useLoadRoutes = () => {
  return useQuery<RouteConfig[], Error>({
    queryKey: ['routes'],  // Clave de consulta
    queryFn: fetchRoutes,  // Función de consulta
    staleTime: 5 * 60 * 1000, // Tiempo de frescura
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
