
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: any;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updateProfile: (data: { firstName?: string; lastName?: string; email?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  // Charger le profil utilisateur depuis la base de données
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return null;
      }

      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  };

  // Initialiser l'authentification
  useEffect(() => {
    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Charger le profil utilisateur
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }

        setIsLoading(false);
      }
    );

    // Vérifier la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { error: error.message };
      }

      if (data.user) {
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${data.user.email}`,
        });
      }

      return {};
    } catch (error: any) {
      console.error('Login failed:', error);
      return { error: error.message || 'Échec de la connexion' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName || '',
            last_name: lastName || '',
          }
        }
      });

      if (error) {
        console.error('Register error:', error);
        return { error: error.message };
      }

      if (data.user) {
        toast({
          title: "Inscription réussie",
          description: `Compte créé pour ${data.user.email}`,
        });
      }

      return {};
    } catch (error: any) {
      console.error('Registration failed:', error);
      return { error: error.message || 'Échec de l\'inscription' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Erreur",
          description: "Échec de la déconnexion",
          variant: "destructive",
        });
      } else {
        setUser(null);
        setSession(null);
        setUserProfile(null);
        toast({
          title: "Déconnexion",
          description: "Vous avez été déconnecté avec succès",
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      return { error: error.message || 'Échec de la réinitialisation' };
    }
  };

  const updateProfile = async (data: { firstName?: string; lastName?: string; email?: string }) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Reload profile
      await loadUserProfile(user.id);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  const isAuthenticated = !!user && !!session;
  const isAdmin = userProfile?.role === 'admin';

  const value = {
    user,
    session,
    userProfile,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
