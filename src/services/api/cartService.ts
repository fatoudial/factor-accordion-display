
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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

export interface AddToCartRequest {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  bookFormat: string;
  imageUrl?: string;
}

export interface CartSummary {
  total: number;
  itemCount: number;
  shippingCost: number;
  grandTotal: number;
}

export const cartService = {
  // Récupérer le panier
  getCart: async (token: string): Promise<CartItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du panier");
      }

      return await response.json();
    } catch (error: any) {
      console.error("Cart API Error:", error);
      throw error;
    }
  },

  // Ajouter au panier
  addToCart: async (token: string, item: AddToCartRequest): Promise<CartItem> => {
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
        throw new Error("Erreur lors de l'ajout au panier");
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  },

  // Mettre à jour la quantité
  updateQuantity: async (token: string, itemId: number, quantity: number): Promise<CartItem> => {
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
        throw new Error("Erreur lors de la mise à jour");
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  },

  // Supprimer du panier
  removeFromCart: async (token: string, itemId: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (error: any) {
      throw error;
    }
  },

  // Vider le panier
  clearCart: async (token: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du vidage du panier");
      }
    } catch (error: any) {
      throw error;
    }
  },

  // Résumé du panier
  getCartSummary: async (token: string): Promise<CartSummary> => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/summary`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du résumé");
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  },
};
