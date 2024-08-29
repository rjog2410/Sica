import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, User } from '../types';

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
      hasPermission: (permissions: string[]) => {
        const user = get().user;
        if (!user) return false;
        return permissions.every(permission => user.permissions.includes(permission));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Rehidratación completada:', state);
        }
      },
    }
  )
);

export default useAuthStore;
