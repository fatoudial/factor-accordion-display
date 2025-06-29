
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Fonction utilitaire pour gérer les erreurs des requêtes
const handleApiError = (error: any) => {
  console.error("Cart API Error:", error);
  toast({
    title: "Erreur du panier",
    description: error.message || "Veuillez réessayer ultérieurement",
    variant: "destructive",
  });
  throw error;
};

export interface CartItem {
  id: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  bookFormat: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  total: number;
  itemCount: number;
  shippingCost: number;
  grandTotal: number;
}

export const cartApi = {
  // Récupérer les articles du panier
  getCartItems: async (token: string): Promise<CartItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
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

  // Ajouter un article au panier
  addToCart: async (token: string, item: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    bookFormat: string;
    imageUrl?: string;
  }): Promise<CartItem> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Mettre à jour la quantité d'un article
  updateCartItem: async (token: string, itemId: number, quantity: number): Promise<CartItem> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Supprimer un article du panier
  removeFromCart: async (token: string, itemId: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Vider le panier
  clearCart: async (token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Récupérer le résumé du panier
  getCartSummary: async (token: string): Promise<CartSummary> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/summary`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
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
};
