
import { toast } from "@/components/ui/use-toast";
import { cartApi, type CartItem } from "./cartApi";
import { backendPaymentApi, type BackendPaymentRequest } from "./backendPaymentApi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Fonction utilitaire pour obtenir le token d'authentification
const getAuthToken = (): string => {
  // Pour la démo, retourner un token fictif
  // Dans une vraie app, récupérer depuis localStorage ou context
  return localStorage.getItem('authToken') || 'demo-token';
};

// API intégrée qui utilise le vrai backend
export const realApi = {
  // Gestion du panier
  cart: {
    getItems: async (): Promise<CartItem[]> => {
      const token = getAuthToken();
      try {
        return await cartApi.getCartItems(token);
      } catch (error) {
        // Fallback vers données mock si backend non disponible
        console.warn("Backend non disponible, utilisation des données mock");
        return [];
      }
    },

    addItem: async (item: {
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      bookFormat: string;
      imageUrl?: string;
    }) => {
      const token = getAuthToken();
      try {
        return await cartApi.addToCart(token, item);
      } catch (error) {
        toast({
          title: "Mode démo",
          description: "Article ajouté au panier (simulation)",
        });
        throw error;
      }
    },

    updateItem: async (itemId: number, quantity: number) => {
      const token = getAuthToken();
      return await cartApi.updateCartItem(token, itemId, quantity);
    },

    removeItem: async (itemId: number) => {
      const token = getAuthToken();
      return await cartApi.removeFromCart(token, itemId);
    },

    clear: async () => {
      const token = getAuthToken();
      return await cartApi.clearCart(token);
    },

    getSummary: async () => {
      const token = getAuthToken();
      return await cartApi.getCartSummary(token);
    }
  },

  // Gestion des paiements
  payments: {
    initiate: async (paymentData: BackendPaymentRequest) => {
      const token = getAuthToken();
      try {
        return await backendPaymentApi.initiatePayment(token, paymentData);
      } catch (error) {
        // Fallback vers l'ancienne API de simulation
        console.warn("Backend payment non disponible, utilisation de la simulation");
        return {
          success: true,
          transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          status: "pending",
          message: "Paiement initié avec succès (simulation)",
        };
      }
    },

    checkStatus: async (transactionId: string) => {
      try {
        return await backendPaymentApi.checkPaymentStatus(transactionId);
      } catch (error) {
        return {
          success: true,
          transactionId,
          status: "success",
          message: "Paiement effectué avec succès (simulation)",
        };
      }
    },

    getHistory: async () => {
      const token = getAuthToken();
      try {
        return await backendPaymentApi.getPaymentHistory(token);
      } catch (error) {
        return [];
      }
    }
  },

  // Test de connectivité backend
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};
