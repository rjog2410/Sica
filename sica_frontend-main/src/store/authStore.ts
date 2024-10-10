import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, User } from '../types/types';

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      logoutInitiated: false,
      setUser: (user: User | null, token: string | null) => set({
        user,
        token,
        isAuthenticated: !!user,
        logoutInitiated: false, // Resetear bandera al iniciar sesión
      }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, logoutInitiated: true }),
      setLogoutInitiated: (initiated: boolean) => set({ logoutInitiated: initiated }),
      hasPermission: (route: string) => {
        const user = get().user;
        if (!user || !user.permissions) return false;
        // Verifica si el usuario tiene acceso a la ruta
       //return user.permissions.includes(route);
          return true;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
       
      },
    }
  )
);

export default useAuthStore;
