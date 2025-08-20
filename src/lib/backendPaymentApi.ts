// Service de paiement Backend Java
import { apiClient, handleApiError } from './backendApi';
import { toast } from '@/hooks/use-toast';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  method: "mobile_money" | "card" | "paypal";
  provider?: string; // orange, wave, mtn, moov
  phoneNumber?: string;
  cardDetails?: {
    number: string;
    name: string;
    expiry: string;
    cvc: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: string;
  message: string;
  payment_url?: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  provider?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  order: {
    id: string;
  };
  createdAt: string;
  completedAt?: string;
  failureReason?: string;
}

class BackendPaymentService {
  // Initier un paiement
  async initiatePayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Initiating payment:', paymentData);
      
      const response = await apiClient.post('/payments/initiate', paymentData);
      
      if (response.success) {
        toast({
          title: "Paiement initié",
          description: "Redirection vers le portail de paiement...",
        });
        
        // Si URL de paiement fournie, rediriger
        if (response.payment_url) {
          window.open(response.payment_url, '_blank');
        }
      }
      
      return response;
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      toast({
        title: "Erreur de paiement",
        description: error.message || "Impossible d'initier le paiement",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Vérifier le statut d'un paiement
  async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await apiClient.get(`/payments/status/${transactionId}`);
      return response;
    } catch (error: any) {
      console.error('Payment status check error:', error);
      throw error;
    }
  }

  // Obtenir l'historique des paiements
  async getPaymentHistory(): Promise<Transaction[]> {
    try {
      const response = await apiClient.get('/payments/history');
      return response;
    } catch (error: any) {
      console.error('Payment history error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Simuler un callback mobile money (pour tests)
  async simulateMobileMoneyCallback(
    transactionId: string, 
    status: "SUCCESS" | "FAILED" | "PENDING"
  ): Promise<PaymentResponse> {
    try {
      const response = await apiClient.post('/payments/callback', {
        transactionId,
        status,
        externalReference: `EXT-${Date.now()}`
      }, false);
      
      toast({
        title: "Callback simulé",
        description: `Transaction ${transactionId} -> ${status}`,
      });
      
      return response;
    } catch (error: any) {
      console.error('Callback simulation error:', error);
      throw error;
    }
  }

  // Orange Money spécifique
  async initiateOrangeMoneyPayment(phoneNumber: string, amount: number, orderId: string): Promise<PaymentResponse> {
    try {
      const response = await apiClient.post('/payments/orange-money/initiate', {
        phoneNumber,
        amount,
        orderId
      });
      
      if (response.payment_url) {
        window.open(response.payment_url, '_blank');
      }
      
      return response;
    } catch (error: any) {
      console.error('Orange Money payment error:', error);
      throw error;
    }
  }

  // Créer une commande temporaire pour les tests
  async createTestOrder(items: any[]): Promise<{ orderId: string }> {
    try {
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const response = await apiClient.post('/orders', {
        items,
        total,
        status: 'PENDING'
      });
      
      return { orderId: response.id };
    } catch (error: any) {
      console.error('Test order creation error:', error);
      throw error;
    }
  }
}

export const backendPaymentService = new BackendPaymentService();