import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  hasCompletedOnboarding: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (name: string, email: string) =>
    set({
      user: { id: 'mock-user-1', name, email, hasCompletedOnboarding: false },
      isAuthenticated: true,
    }),
  logout: () => set({ user: null, isAuthenticated: false }),
  completeOnboarding: () =>
    set((state) => ({
      user: state.user ? { ...state.user, hasCompletedOnboarding: true } : null,
    })),
}));
