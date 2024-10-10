// src/types.ts

// Definición del tipo para el usuario
export interface User {
    id: string;
    name: string;
    username: string;
    roles: string[];          // Lista de roles del usuario
    permissions: string[];    // Lista de permisos del usuario
  }
  
  // Definición del estado de autenticación
  export interface AuthState {
    user: User | null;         // Datos del usuario autenticado
    isAuthenticated: boolean;  // Indica si el usuario está autenticado
    token: string | null;      // Token de autenticación JWT
    logoutInitiated: boolean;  // Indica si el proceso de logout ha sido iniciado
    setUser: (user: User | null, token: string | null) => void;  // Función para establecer los datos del usuario
    logout: () => void;        // Función para cerrar sesión
    setLogoutInitiated: (initiated: boolean) => void;  // Función para marcar que el logout fue iniciado
    hasPermission: (route: string) => boolean; // Método para validar permisos (rutas)
  }
  
  // Definición del tipo de la respuesta al validar el token
  export interface VerifyTokenResponse {
    id: string;
    name: string;
    username: string;
    roles: string[];
    permissions: string[];
  }
  
  // Definición del tipo para el contexto de notificaciones
  export interface NotificationContextProps {
    notify: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  }
  