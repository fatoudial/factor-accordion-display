
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Fonction utilitaire pour gérer les erreurs des requêtes
const handleApiError = (error: any) => {
  console.error("Backend Payment API Error:", error);
  toast({
    title: "Erreur de paiement",
    description: error.message || "Veuillez réessayer ultérieurement",
    variant: "destructive",
  });
  throw error;
};

export interface BackendPaymentRequest {
  orderId: number;
  amount: number;
  method: "mobile_money" | "card" | "paypal";
  provider?: string;
  phoneNumber?: string;
}

export interface BackendPaymentResponse {
  success: boolean;
  transactionId: string;
  status: string;
  message: string;
  amount?: number;
  completedAt?: string;
  payment_url?: string;
}

export interface PaymentHistory {
  id: number;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  provider?: string;
  phoneNumber?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
  completedAt?: string;
  order: {
    id: number;
    orderReference: string;
  };
}

export const backendPaymentApi = {
  // Initier un paiement
  initiatePayment: async (token: string, paymentData: BackendPaymentRequest): Promise<BackendPaymentResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/initiate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Vérifier le statut d'un paiement
  checkPaymentStatus: async (transactionId: string): Promise<BackendPaymentResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/status/${transactionId}`, {
        method: "GET",
        headers: {
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

  // Récupérer l'historique des paiements
  getPaymentHistory: async (token: string): Promise<PaymentHistory[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/history`, {
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

  // Simuler un callback de paiement (pour tests)
  simulateCallback: async (transactionId: string, status: 'SUCCESS' | 'FAILED'): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId,
          status,
          externalReference: `EXT-${Date.now()}`,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};
