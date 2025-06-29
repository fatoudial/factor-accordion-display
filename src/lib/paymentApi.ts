
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Fonction utilitaire pour gérer les erreurs des requêtes
const handleApiError = (error: any) => {
  console.error("Payment API Error:", error);
  toast({
    title: "Erreur de paiement",
    description: error.message || "Veuillez réessayer ultérieurement",
    variant: "destructive",
  });
  throw error;
};

export interface PaymentRequest {
  orderId: string;
  amount: number;
  method: "mobile_money" | "card" | "paypal";
  provider?: string;
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
}

// Interface pour l'historique des transactions (utilisée par le back-office)
export interface TransactionHistory {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  currency: string;
  method: string;
  provider?: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
  lastStatusChange?: Date;
  metadata?: Record<string, any>;
}

// Données simulées pour le back-office (à remplacer par de vraies données API)
const mockTransactions: TransactionHistory[] = [
  {
    id: "txn-001",
    userId: "user-001",
    userEmail: "client1@example.com",
    userName: "Jean Dupont",
    amount: 15000,
    currency: "XOF",
    method: "mobile_money",
    provider: "Orange Money",
    status: "success",
    orderId: "order-001",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 jours avant
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: "txn-002",
    userId: "user-002",
    userEmail: "client2@example.com",
    userName: "Marie Diop",
    amount: 25000,
    currency: "XOF",
    method: "card",
    status: "success",
    orderId: "order-002",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 jour avant
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: "txn-003",
    userId: "user-003",
    userEmail: "client3@example.com",
    userName: "Amadou Sall",
    amount: 5000,
    currency: "XOF",
    method: "mobile_money",
    provider: "Wave",
    status: "pending",
    orderId: "order-003",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 heures avant
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  },
  {
    id: "txn-004",
    userId: "test-user-001",
    userEmail: "mbodjfaticha99@gmail.com",
    userName: "Faticha Mbodj",
    amount: 15000,
    currency: "XOF",
    method: "mobile_money",
    provider: "Orange Money",
    status: "pending",
    orderId: "order-004",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 heure avant
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  }
];

export const paymentApi = {
  // Initier un paiement
  initiatePayment: async (token: string, paymentData: PaymentRequest): Promise<PaymentResponse> => {
    try {
      // Pour la démo, nous simulons un appel API
      console.log("Initiating payment:", paymentData);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: "pending",
        message: "Paiement initié avec succès",
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Vérifier le statut d'un paiement
  checkPaymentStatus: async (token: string, transactionId: string): Promise<PaymentResponse> => {
    try {
      // Pour la démo, nous simulons un appel API
      console.log("Checking payment status for transaction:", transactionId);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 80% des paiements sont réussis dans notre démo
      const isSuccess = Math.random() > 0.2;
      
      return {
        success: isSuccess,
        transactionId,
        status: isSuccess ? "success" : "failed",
        message: isSuccess 
          ? "Paiement effectué avec succès" 
          : "Le paiement a échoué. Veuillez réessayer.",
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Simuler un callback de paiement mobile money (pour démo)
  simulateMobileMoneyCallback: async (
    token: string, 
    transactionId: string, 
    status: "success" | "failed" | "pending"
  ): Promise<PaymentResponse> => {
    try {
      // Pour la démo, nous simulons un appel API
      console.log("Simulating mobile money callback for transaction:", transactionId, "with status:", status);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: status === "success",
        transactionId,
        status,
        message: status === "success" 
          ? "Paiement validé par mobile money" 
          : status === "failed" 
            ? "Paiement refusé par mobile money" 
            : "Paiement en attente de validation",
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  // Récupérer l'historique des paiements
  getPaymentHistory: async (token: string): Promise<TransactionHistory[]> => {
    try {
      // Pour la démo, nous retournons des données simulées
      console.log("Fetching payment history");
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return mockTransactions;
    } catch (error: any) {
      return handleApiError(error);
    }
  },
  
  // Récupérer les détails d'une transaction (pour le back-office)
  getTransactionDetails: async (token: string, transactionId: string): Promise<TransactionHistory> => {
    try {
      console.log("Fetching transaction details for:", transactionId);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const transaction = mockTransactions.find(t => t.id === transactionId);
      if (!transaction) {
        throw new Error("Transaction introuvable");
      }
      
      return transaction;
    } catch (error: any) {
      return handleApiError(error);
    }
  },
  
  // Valider manuellement une transaction (pour le back-office)
  approveTransaction: async (token: string, transactionId: string): Promise<PaymentResponse> => {
    try {
      console.log("Manually approving transaction:", transactionId);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        transactionId,
        status: "success",
        message: "Transaction approuvée manuellement",
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
  
  // Rejeter une transaction (pour le back-office)
  rejectTransaction: async (token: string, transactionId: string, reason: string): Promise<PaymentResponse> => {
    try {
      console.log("Manually rejecting transaction:", transactionId, "Reason:", reason);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        transactionId,
        status: "failed",
        message: `Transaction rejetée: ${reason}`,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
  
  // Émettre un remboursement (pour le back-office)
  refundTransaction: async (token: string, transactionId: string, amount?: number): Promise<PaymentResponse> => {
    try {
      console.log("Processing refund for transaction:", transactionId, "Amount:", amount || "full refund");
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        transactionId,
        status: "refunded",
        message: amount 
          ? `Remboursement partiel de ${amount} FCFA effectué` 
          : "Remboursement complet effectué",
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  }
};
