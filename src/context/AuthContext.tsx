import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User; requiresVerification?: boolean }>;
  register: (name: string, email: string, password: string, phone?: string, country?: string) => Promise<{ success: boolean; error?: string; user?: User; requiresVerification?: boolean; message?: string }>;
  logout: () => void;
  refreshSession: () => void;
  updateProfile: (updates: Partial<Omit<User, 'role' | 'id' | 'createdAt'>>) => Promise<{ success: boolean; error?: string; user?: User }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = useCallback(() => {
    const current = authService.getCurrentUser();
    setUser(current);
  }, []);

  useEffect(() => {
    refreshSession();
    setIsLoading(false);
  }, [refreshSession]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await authService.login(email, password);
    setIsLoading(false);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true, user: res.user };
    }
    return {
      success: false,
      error: res.error || 'Invalid credentials',
      requiresVerification: res.requiresVerification
    };
  };

  const register = async (name: string, email: string, password: string, phone?: string, country?: string) => {
    setIsLoading(true);
    const res = await authService.register(name, email, password, phone, country);
    setIsLoading(false);
    if (res.success) {
      return {
        success: true,
        user: res.user,
        requiresVerification: res.requiresVerification,
        message: res.message
      };
    }
    return { success: false, error: res.error || 'Failed to create account' };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<Omit<User, 'role' | 'id' | 'createdAt'>>) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      const updated = authService.updateProfile(user.id, updates);
      setUser(updated);
      return { success: true, user: updated };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        logout,
        refreshSession,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

