// Context d'authentification Backend
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { backendAuthService, User } from '@/lib/backendAuthApi';

interface BackendAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const BackendAuthContext = createContext<BackendAuthContextType | null>(null);

export const useBackendAuth = () => {
  const context = useContext(BackendAuthContext);
  if (!context) {
    throw new Error('useBackendAuth must be used within a BackendAuthProvider');
  }
  return context;
};

interface BackendAuthProviderProps {
  children: ReactNode;
}

export const BackendAuthProvider: React.FC<BackendAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier le token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const currentUser = await backendAuthService.verifyToken();
        setUser(currentUser);
      } catch (error) {
        console.error('Token verification failed:', error);
        backendAuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await backendAuthService.login({ email, password });
      if (response.success) {
        setUser(response.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      const response = await backendAuthService.register({ 
        email, 
        password, 
        firstName, 
        lastName 
      });
      if (response.success) {
        setUser(response.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    backendAuthService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await backendAuthService.verifyToken();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  const value: BackendAuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isLoading,
    login,
    register,
    logout,
    refreshUser
  };

  return (
    <BackendAuthContext.Provider value={value}>
      {children}
    </BackendAuthContext.Provider>
  );
};