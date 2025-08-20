
import { supabase } from '@/integrations/supabase/client';
import { paymentService } from '@/lib/paymentService';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { useState } from 'react';

export const CheckoutButton = ({ 
  amount, 
  description = "Livre Tchat Souvenir", 
  bookId, 
  shippingAddress,
  onPaymentSuccess 
}: {
  amount: number;
  description?: string;
  bookId?: string;
  shippingAddress?: any;
  onPaymentSuccess?: (result: any) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const paymentData = {
        amount,
        currency: 'eur',
        description,
        bookId,
        shippingAddress
      };

      const result = await paymentService.createPayment(paymentData);
      
      if (result.success && result.url) {
        // Rediriger vers Stripe Checkout
        paymentService.redirectToCheckout(result.url, false);
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de créer la session de paiement",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-ts-forest hover:bg-ts-forest/90 text-white font-medium py-3"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Redirection vers le paiement...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payer {amount}€
        </div>
      )}
    </Button>
  );
};

// Garder l'ancien PaymentSimulator pour compatibilité
const PaymentSimulator = ({ 
  amount, 
  bookId, 
  bookTitle = "Mon livre souvenir", 
  onSuccess, 
  onCancel 
}: {
  amount: number;
  bookId?: number;
  bookTitle?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  return (
    <div className="space-y-6">
      <CheckoutButton
        amount={amount / 100} // Convert from cents to euros
        description={bookTitle}
        bookId={bookId?.toString()}
        onPaymentSuccess={onSuccess}
      />
      
      {onCancel && (
        <Button variant="outline" onClick={onCancel} className="w-full">
          Annuler
        </Button>
      )}
    </div>
  );
};

export default PaymentSimulator;
