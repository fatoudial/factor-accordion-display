
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export interface PaymentRequest {
  orderId: number;
  amount: number;
  method: "mobile_money" | "card" | "paypal";
  provider?: string;
  phoneNumber?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: string;
  message: string;
  amount?: number;
  completedAt?: string;
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

export const paymentService = {
  // Initier un paiement
  initiatePayment: async (token: string, paymentData: PaymentRequest): Promise<PaymentResponse> => {
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
        throw new Error("Erreur lors de l'initiation du paiement");
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  },

  // Vérifier le statut du paiement
  checkPaymentStatus: async (transactionId: string): Promise<PaymentResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/status/${transactionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la vérification du statut");
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  },

  // Historique des paiements
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
        throw new Error("Erreur lors de la récupération de l'historique");
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  },

  // Paiement Orange Money spécifique
  initiateOrangeMoneyPayment: async (
    token: string, 
    phoneNumber: string, 
    amount: number, 
    orderId: number
  ): Promise<PaymentResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/orange-money/initiate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          amount,
          orderId,
          provider: "orange_money"
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors du paiement Orange Money");
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  },
};
