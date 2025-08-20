// Formulaire de paiement connecté au backend Java
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CreditCard, Smartphone, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useBackendAuth } from '@/context/BackendAuthContext';
import { backendPaymentService } from '@/lib/backendPaymentApi';
import { toast } from '@/hooks/use-toast';
import MobileMoneyForm from './MobileMoneyForm';
import CreditCardForm from './CreditCardForm';

interface BackendPaymentFormProps {
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

const BackendPaymentForm: React.FC<BackendPaymentFormProps> = ({ onSuccess, onError }) => {
  const { items, total, clearCart } = useCart();
  const { user, isAuthenticated } = useBackendAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("mobile_money");

  // Créer une commande et initier le paiement
  const handlePayment = async (paymentData: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour effectuer un paiement",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Créer une commande temporaire
      const { orderId } = await backendPaymentService.createTestOrder(items);
      
      // Initier le paiement
      const paymentRequest = {
        orderId,
        amount: total,
        method: paymentData.method,
        provider: paymentData.provider,
        phoneNumber: paymentData.phoneNumber,
        cardDetails: paymentData.cardDetails
      };
      
      const response = await backendPaymentService.initiatePayment(paymentRequest);
      
      if (response.success) {
        toast({
          title: "Paiement initié",
          description: `Transaction ${response.transactionId} en cours...`,
        });
        
        // Simuler le suivi du paiement
        setTimeout(async () => {
          try {
            const statusResponse = await backendPaymentService.checkPaymentStatus(response.transactionId);
            
            if (statusResponse.status === 'SUCCESS') {
              clearCart();
              onSuccess?.(response.transactionId);
              
              toast({
                title: "Paiement réussi !",
                description: "Votre commande a été confirmée",
              });
            } else if (statusResponse.status === 'FAILED') {
              onError?.("Le paiement a échoué");
            }
          } catch (error) {
            console.error('Payment status check failed:', error);
          }
        }, 3000);
      }
      
    } catch (error: any) {
      console.error('Payment failed:', error);
      onError?.(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="mb-4">Connectez-vous pour effectuer un paiement</p>
            <Button onClick={() => window.location.href = '/login'}>
              Se connecter
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paiement sécurisé</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total à payer: <span className="font-semibold">{total.toLocaleString()} FCFA</span>
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mobile_money" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Mobile Money
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Carte
            </TabsTrigger>
            <TabsTrigger value="paypal" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              PayPal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mobile_money" className="space-y-4">
            <MobileMoneyForm 
              onSubmit={handlePayment}
              isProcessing={isProcessing}
            />
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <CreditCardForm 
              onSubmit={(data) => handlePayment({ ...data, method: 'card' })}
              isProcessing={isProcessing}
            />
          </TabsContent>

          <TabsContent value="paypal" className="space-y-4">
            <div className="text-center py-8">
              <Button 
                onClick={() => handlePayment({ method: 'paypal' })}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirection PayPal...
                  </>
                ) : (
                  "Payer avec PayPal"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Informations de test */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Mode Test</h4>
          <p className="text-sm text-blue-600">
            Les paiements sont simulés. Orange Money: numéros test commençant par 07.
            Cartes: utilisez 4242 4242 4242 4242.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendPaymentForm;