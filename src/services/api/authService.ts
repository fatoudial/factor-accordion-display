
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export const authService = {
  // Connexion
  signin: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Identifiants incorrects");
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || "Erreur de connexion");
    }
  },

  // Inscription
  signup: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Erreur lors de l'inscription");
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de l'inscription");
    }
  },

  // Mot de passe oublié
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de l'email");
      }
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de l'envoi de l'email");
    }
  },

  // Réinitialisation du mot de passe
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la réinitialisation");
      }
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de la réinitialisation");
    }
  },

  // Vérification du token
  verifyToken: async (token: string): Promise<AuthResponse['user']> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Token invalide");
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || "Token invalide");
    }
  },
};
