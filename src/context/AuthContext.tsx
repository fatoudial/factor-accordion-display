
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/authApi';
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

// Compte de test préconfigué
const TEST_EMAIL = 'mbodjfaticha99@gmail.com';
const TEST_PASSWORD = 'passer';
const TEST_USER: User = {
  id: "test-user-001",
  email: TEST_EMAIL,
  firstName: "Faticha",
  lastName: "Mbodj",
  role: "USER",
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  lastLogin: new Date()
};

// Compte admin préconfigué
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'passer';
const ADMIN_USER: User = {
  id: "admin-user-001",
  email: ADMIN_EMAIL,
  firstName: "Admin",
  lastName: "System",
  role: "ADMIN",
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  lastLogin: new Date()
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
          // Pour le compte de test, vérifions si c'est lui qui est connecté
          if (storedToken.startsWith('test-token-')) {
            setUser(TEST_USER);
            setToken(storedToken);
          } else if (storedToken.startsWith('admin-token-')) {
            setUser(ADMIN_USER);
            setToken(storedToken);
          } else {
            // Sinon, vérifier avec l'API
            const userData = await authApi.verifyToken(storedToken);
            setUser(userData);
            setToken(storedToken);
          }
        } catch (error) {
          // Token invalide ou expiré
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
      // Vérifier si c'est le compte test
      if (email.toLowerCase() === TEST_EMAIL.toLowerCase() && password === TEST_PASSWORD) {
        // Simuler une connexion réussie avec le compte test
        const testToken = "test-token-" + Date.now();
        localStorage.setItem('authToken', testToken);
        setUser(TEST_USER);
        setToken(testToken);
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${TEST_USER.firstName}!`,
        });
        setIsLoading(false);
        return;
      } 
      // Vérifier si c'est le compte admin
      else if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        // Simuler une connexion réussie avec le compte admin
        const adminToken = "admin-token-" + Date.now();
        localStorage.setItem('authToken', adminToken);
        setUser(ADMIN_USER);
        setToken(adminToken);
        toast({
          title: "Connexion administrateur réussie",
          description: `Bienvenue, ${ADMIN_USER.firstName}!`,
        });
        setIsLoading(false);
        return;
      }
      
      // Sinon, procéder à l'authentification normale
      const { user: userData, token: authToken } = await authApi.login(email, password);
      localStorage.setItem('authToken', authToken);
      setUser(userData);
      setToken(authToken);
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${userData.firstName}!`,
      });
    } catch (error) {
      toast({
        title: "Échec de connexion",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    if (token) {
      try {
        // Ne pas appeler l'API pour le compte test
        if (!token.startsWith('test-token-')) {
          await authApi.logout(token);
        }
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
      }
    }
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
      await authApi.register(email, password, firstName, lastName);
      toast({
        title: "Inscription réussie",
        description: "Vous pouvez maintenant vous connecter.",
      });
    } catch (error) {
      toast({
        title: "Échec de l'inscription",
        description: "Une erreur est survenue lors de l'inscription.",
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

    setIsLoading(true);
    try {
      // Pour le compte test, simuler une mise à jour locale
      if (token.startsWith('test-token-')) {
        const updatedUser = { ...TEST_USER, ...userData };
        setUser(updatedUser);
      } else {
        const updatedUser = await authApi.updateProfile(token, userData);
        setUser(updatedUser);
      }
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Échec de la mise à jour",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
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

    setIsLoading(true);
    try {
      await authApi.updatePassword(token, currentPassword, newPassword);
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été changé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Échec de la mise à jour",
        description: "Une erreur est survenue lors du changement de mot de passe.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
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
