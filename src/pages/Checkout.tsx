
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from '@/components/payment/PaymentSimulator';
import ShippingForm from '@/components/checkout/ShippingForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { paymentService } from '@/lib/paymentService';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentStep, setPaymentStep] = useState<'shipping' | 'payment' | 'success' | 'error'>('shipping');
  const [orderResult, setOrderResult] = useState<any>(null);
  const { items: cartItems, total, clearCart } = useCart();
  const { user } = useAuth();

  // Check for payment result on component mount
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (sessionId && success === 'true') {
      handlePaymentSuccess(sessionId);
    } else if (canceled === 'true') {
      setPaymentStep('error');
      toast({
        title: "Paiement annulé",
        description: "Votre paiement a été annulé. Vous pouvez réessayer.",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  const handlePaymentSuccess = async (sessionId: string) => {
    try {
      const result = await paymentService.verifyPayment(sessionId);
      
      if (result.success) {
        setOrderResult(result);
        setPaymentStep('success');
        clearCart();
        
        // Notify printer
        if (result.orderId) {
          await paymentService.notifyPrinter(result.orderId);
        }
        
        toast({
          title: "Paiement réussi !",
          description: "Votre commande a été confirmée et l'imprimeur a été notifié.",
        });
      } else {
        setPaymentStep('error');
        toast({
          title: "Erreur de vérification",
          description: result.error || "Impossible de vérifier le paiement",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStep('error');
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la vérification du paiement",
        variant: "destructive",
      });
    }
  };

  const handleShippingSubmit = (address: any) => {
    setShippingAddress(address);
    setPaymentStep('payment');
  };

  if (paymentStep === 'success') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Paiement réussi !</CardTitle>
            <CardDescription>
              Votre commande a été confirmée et l'imprimeur a été notifié.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderResult && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Détails de la commande :</h3>
                <p><strong>Commande :</strong> #{orderResult.orderId}</p>
                <p><strong>Montant :</strong> {orderResult.sessionDetails?.amountTotal / 100}€</p>
                <p><strong>Email :</strong> {orderResult.sessionDetails?.customerEmail}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button onClick={() => navigate('/dashboard')} className="flex-1">
                Voir mes commandes
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'error') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-700">Erreur de paiement</CardTitle>
            <CardDescription>
              Une erreur s'est produite lors du traitement de votre paiement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button onClick={() => setPaymentStep('payment')} className="flex-1">
                Réessayer le paiement
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            onClick={() => paymentStep === 'payment' ? setPaymentStep('shipping') : navigate('/cart')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">
            {paymentStep === 'shipping' ? 'Informations de livraison' : 'Paiement'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {paymentStep === 'shipping' && (
              <ShippingForm onSubmit={handleShippingSubmit} />
            )}
            
            {paymentStep === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle>Paiement sécurisé</CardTitle>
                  <CardDescription>
                    Procédez au paiement de votre commande via Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CheckoutButton
                    amount={total}
                    description={`Commande Tchat Souvenir (${cartItems.length} article${cartItems.length > 1 ? 's' : ''})`}
                    shippingAddress={shippingAddress}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
