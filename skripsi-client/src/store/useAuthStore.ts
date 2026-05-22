import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  email: string | null;
  role: string | null;
  _hasHydrated: boolean;
  setAuth: (token: string, email: string, role: string) => void;
  setHasHydrated: (state: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      role: null,
      _hasHydrated: false,
      setAuth: (token, email, role) => set({ token, email, role }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      logout: () => set({ token: null, email: null, role: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);