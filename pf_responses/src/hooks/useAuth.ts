import { create } from 'zustand';
import { authService, RegisterData } from '@/services/auth.service';

interface User {
  username: string;
  email: string;
  phone?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: RegisterData) => Promise<any>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      // Verificar el token y obtener datos del usuario
      const userData = await authService.getCurrentUser();
      set({ 
        user: userData,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Error checking auth:', error);
      // Si hay un error, limpiamos el token y el estado
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      
      // Obtener datos del usuario después del login
      const userData = await authService.getCurrentUser();
      set({ 
        user: userData,
        isAuthenticated: true,
        isLoading: false
      });
      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    set({ 
      user: null, 
      isAuthenticated: false,
      isLoading: false
    });
  },

  updateUser: async (userData: Partial<User>) => {
    try {
      set({ isLoading: true });
      const updatedUser = await authService.updateUser(userData);
      set((state) => ({
        user: {
          ...state.user,
          ...updatedUser
        },
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  }
}));