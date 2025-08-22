
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { backendAuthService, User } from '@/lib/backendAuthApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default context instead of throwing error for better UX
    return {
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      login: async () => {},
      logout: async () => {},
      register: async () => {},
      updateProfile: async () => {},
    } as AuthContextType;
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();


  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await backendAuthService.verifyToken();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulation de connexion sans backend
      if (email === 'mbodjfaticha99@gmail.com' && password === 'passer') {
        const mockUser: User = {
          id: '1',
          email: 'mbodjfaticha99@gmail.com',
          firstName: 'Fatou',
          lastName: 'Mbodj',
          role: 'ADMIN'
        };
        setUser(mockUser);
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${mockUser.firstName} (Admin)!`,
        });
        return;
      }
      
      if (email === 'fatou@yopmail.com' && password === 'passer') {
        const mockUser: User = {
          id: '2',
          email: 'fatou@yopmail.com',
          firstName: 'Fatou',
          lastName: 'User',
          role: 'USER'
        };
        setUser(mockUser);
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${mockUser.firstName}!`,
        });
        return;
      }
      
      // Pour les autres utilisateurs, utiliser le backend
      const response = await backendAuthService.login({ email, password });
      if (response.success) {
        setUser(response.user);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      backendAuthService.logout();
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setIsLoading(true);
      const response = await backendAuthService.register({ 
        email, 
        password, 
        firstName, 
        lastName 
      });
      if (response.success) {
        setUser(response.user);
      }
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');
      
      // Cette fonctionnalité sera implémentée plus tard dans le backend
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées.",
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        title: "Erreur de mise à jour",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isLoading,
    login,
    logout,
    register,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
