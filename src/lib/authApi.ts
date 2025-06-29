
import { toast } from "@/components/ui/use-toast";
import type { User, UserSession } from "@/types/user";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Fonction utilitaire pour gérer les erreurs des requêtes
const handleApiError = (error: any) => {
  console.error("API Error:", error);
  toast({
    title: "Erreur de communication avec le serveur",
    description: error.message || "Veuillez réessayer ultérieurement",
    variant: "destructive",
  });
  throw error;
};

export const authApi = {
  // Inscription d'un nouvel utilisateur
  register: async (email: string, password: string, firstName: string, lastName: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Connexion d'un utilisateur
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Vérification d'un token
  verifyToken: async (token: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Déconnexion
  logout: async (token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Mise à jour du mot de passe
  updatePassword: async (token: string, currentPassword: string, newPassword: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Mise à jour du profil utilisateur
  updateProfile: async (token: string, userData: Partial<User>): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Demande de réinitialisation de mot de passe
  forgotPassword: async (email: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Réinitialisation du mot de passe
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};
