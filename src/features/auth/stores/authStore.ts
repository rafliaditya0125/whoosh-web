/**
 * Authentication Store (Zustand)
 * 
 * Manages authentication state:
 * - User data
 * - JWT token
 * - Login/logout actions
 * - Persists to localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (userData: Partial<User>) => void;
  setToken: (newToken: string) => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  getRole: () => UserRole | null;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isUser: () => boolean;
  isActive: () => boolean;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      
      /**
       * Set user and token after successful login
       */
      login: (user: User, token: string) => {
        // Store token in localStorage for axios interceptor
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      /**
       * Clear user and token on logout
       */
      logout: () => {
        // Clear localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      /**
       * Update user data (e.g., after profile update)
       */
      setUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        const updatedUser = { ...currentUser, ...userData };
        
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        
        set({
          user: updatedUser,
        });
      },

      /**
       * Update token (e.g., after token refresh)
       */
      setToken: (newToken: string) => {
        localStorage.setItem('auth_token', newToken);
        
        set({
          token: newToken,
        });
      },

      /**
       * Check if user has specific role
       */
      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      },

      /**
       * Check if user has any of the specified roles
       */
      hasAnyRole: (roles: UserRole[]) => {
        const { user } = get();
        return user ? roles.includes(user.role) : false;
      },

      /**
       * Get user role
       */
      getRole: () => {
        const { user } = get();
        return user?.role || null;
      },

      /**
       * Check if user is admin
       */
      isAdmin: () => {
        return get().hasRole('admin');
      },

      /**
       * Check if user is manager
       */
      isManager: () => {
        return get().hasRole('manager');
      },

      /**
       * Check if user is regular user
       */
      isUser: () => {
        return get().hasRole('user');
      },

      /**
       * Check if user account is active
       */
      isActive: () => {
        const { user } = get();
        return user?.is_active !== false;
      },
    }),
    {
      name: 'whoosh-auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
