
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  updateProfile: (userData: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default context instead of throwing error for better UX
    return {
      user: null,
      profile: null,
      session: null,
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();


  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Check for existing session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setIsLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile data for existing session
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (!mounted) return;
            
            if (profileError) {
              console.error('Error fetching profile:', profileError);
            } else {
              setProfile(profileData);
            }
          } catch (error) {
            console.error('Profile fetch error:', error);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid blocking
          setTimeout(async () => {
            if (!mounted) return;
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (mounted && !error) {
                setProfile(profileData);
              }
            } catch (error) {
              console.error('Profile fetch error:', error);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Impossible de se connecter",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) throw error;

      if (data.user && !data.session) {
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte.",
        });
      } else {
        toast({
          title: "Inscription réussie",
          description: "Bienvenue !",
        });
      }
    } catch (error: any) {
      console.error('Register error:', error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Impossible de créer le compte",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<Profile>) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
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
    profile,
    session,
    isAuthenticated: !!session,
    isAdmin: profile?.role === 'ADMIN',
    isLoading,
    login,
    logout,
    register,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
