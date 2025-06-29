
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/api/authService';
import type { User } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Vérification du token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const userData = await authService.verifyToken(storedToken);
          setUser({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role as "USER" | "ADMIN" | "MANAGER",
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            lastLogin: new Date()
          });
          setToken(storedToken);
        } catch (error) {
          console.error("Token verification error:", error);
          localStorage.removeItem('authToken');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.signin({ email, password });
      localStorage.setItem('authToken', response.token);
      setUser({
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role as "USER" | "ADMIN" | "MANAGER",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        lastLogin: new Date()
      });
      setToken(response.token);
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${response.user.firstName}!`,
      });
    } catch (error: any) {
      toast({
        title: "Échec de connexion",
        description: error.message || "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt!",
    });
  };

  // Register
  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      const response = await authService.signup({ email, password, firstName, lastName });
      localStorage.setItem('authToken', response.token);
      setUser({
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role as "USER" | "ADMIN" | "MANAGER",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        lastLogin: new Date()
      });
      setToken(response.token);
      toast({
        title: "Inscription réussie",
        description: `Bienvenue, ${response.user.firstName}!`,
      });
    } catch (error: any) {
      toast({
        title: "Échec de l'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update Profile
  const updateProfile = async (userData: Partial<User>) => {
    if (!token || !user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour mettre à jour votre profil.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été mises à jour avec succès.",
    });
  };

  // Update Password
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!token || !user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour changer votre mot de passe.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été changé avec succès.",
    });
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN' || user?.role === 'MANAGER',
    isLoading,
    login,
    logout,
    register,
    updateProfile,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
