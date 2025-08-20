import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PaymentData {
  amount: number;
  currency?: string;
  description?: string;
  bookId?: string;
  shippingAddress?: any;
}

export interface PaymentResult {
  success: boolean;
  sessionId?: string;
  orderId?: string;
  url?: string;
  error?: string;
}

export const paymentService = {
  /**
   * Créer une session de paiement Stripe
   */
  async createPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      console.log('Creating payment with data:', paymentData);
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: paymentData
      });

      if (error) {
        console.error('Payment creation error:', error);
        toast({
          title: "Erreur de paiement",
          description: error.message || "Impossible de créer la session de paiement",
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      console.log('Payment session created:', data);
      return { 
        success: true, 
        sessionId: data.sessionId,
        orderId: data.orderId,
        url: data.url 
      };
    } catch (error: any) {
      console.error('Unexpected payment error:', error);
      toast({
        title: "Erreur inattendue",
        description: "Une erreur inattendue s'est produite lors de la création du paiement",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  },

  /**
   * Vérifier le statut d'un paiement
   */
  async verifyPayment(sessionId: string): Promise<any> {
    try {
      console.log('Verifying payment for session:', sessionId);
      
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) {
        console.error('Payment verification error:', error);
        return { success: false, error: error.message };
      }

      console.log('Payment verified:', data);
      return data;
    } catch (error: any) {
      console.error('Unexpected verification error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Notifier l'imprimeur d'une nouvelle commande
   */
  async notifyPrinter(orderId: string, printerEmail?: string): Promise<any> {
    try {
      console.log('Notifying printer for order:', orderId);
      
      const { data, error } = await supabase.functions.invoke('notify-printer', {
        body: { orderId, printerEmail }
      });

      if (error) {
        console.error('Printer notification error:', error);
        return { success: false, error: error.message };
      }

      console.log('Printer notified:', data);
      toast({
        title: "Imprimeur notifié",
        description: "L'imprimeur a été informé de votre commande",
      });
      return data;
    } catch (error: any) {
      console.error('Unexpected notification error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Rediriger vers Stripe Checkout
   */
  redirectToCheckout(url: string, openInNewTab: boolean = true): void {
    if (openInNewTab) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  }
};