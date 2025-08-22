import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CreditCard, Smartphone } from 'lucide-react';
import { orderService, paymentService, formatPrice } from '@/lib/supabaseServices';
import { useNavigate } from 'react-router-dom';

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code?: string;
}

const CompleteCheckout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<'shipping' | 'payment' | 'processing'>('shipping');
  const [orderId, setOrderId] = useState<string>('');
  
  // Données d'expédition
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: 'Sénégal',
    postal_code: ''
  });

  // Données de paiement
  const [paymentMethod, setPaymentMethod] = useState<'orange_money' | 'wave' | 'credit_card'>('orange_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour passer commande",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Créer la commande
      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price
        })),
        shipping_address: shippingAddress,
        book_format: items[0]?.format || 'A4',
        book_title: `Livre de conversation - ${new Date().getFullYear()}`
      };

      const order = await orderService.createOrder(orderData);
      setOrderId(order.id);
      setStep('payment');

      toast({
        title: "Commande créée",
        description: `Votre commande ${order.order_reference} a été créée avec succès`,
      });

    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la commande",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStep('processing');

    try {
      const paymentData = {
        order_id: orderId,
        payment_method: paymentMethod,
        phone_number: phoneNumber || undefined,
        card_details: paymentMethod === 'credit_card' ? cardDetails : undefined
      };

      const result = await paymentService.processPayment(paymentData);

      if (result.success) {
        clearCart();
        toast({
          title: "Paiement réussi !",
          description: "Votre commande a été traitée avec succès",
        });
        navigate(`/orders/${orderId}`);
      } else {
        toast({
          title: "Échec du paiement",
          description: result.message,
          variant: "destructive",
        });
        setStep('payment');
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue lors du paiement",
        variant: "destructive",
      });
      setStep('payment');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
            <p className="mb-4">Vous devez être connecté pour passer commande</p>
            <Button onClick={() => navigate('/login')}>Se connecter</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulaire principal */}
          <div>
            {step === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle>Informations de livraison</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          value={shippingAddress.name}
                          onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingAddress.email}
                          onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Pays</Label>
                        <Input
                          id="country"
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Création de la commande...
                        </>
                      ) : (
                        'Continuer vers le paiement'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle>Méthode de paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="orange_money" id="orange" />
                        <Label htmlFor="orange" className="flex items-center cursor-pointer">
                          <Smartphone className="mr-2 h-5 w-5 text-orange-500" />
                          Orange Money
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="wave" id="wave" />
                        <Label htmlFor="wave" className="flex items-center cursor-pointer">
                          <Smartphone className="mr-2 h-5 w-5 text-blue-500" />
                          Wave
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="credit_card" id="card" />
                        <Label htmlFor="card" className="flex items-center cursor-pointer">
                          <CreditCard className="mr-2 h-5 w-5 text-gray-500" />
                          Carte bancaire
                        </Label>
                      </div>
                    </RadioGroup>

                    {(paymentMethod === 'orange_money' || paymentMethod === 'wave') && (
                      <div>
                        <Label htmlFor="phone">
                          Numéro de téléphone {paymentMethod === 'orange_money' ? 'Orange Money' : 'Wave'}
                        </Label>
                        <Input
                          id="phone"
                          placeholder={paymentMethod === 'orange_money' ? '07 XX XX XX XX' : '78 XXX XX XX'}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {paymentMethod === 'orange_money' ? 
                            'Pour les tests, utilisez un numéro commençant par 07' :
                            'Pour les tests, utilisez un numéro commençant par 78'
                          }
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'credit_card' && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Numéro de carte</Label>
                          <Input
                            id="cardNumber"
                            placeholder="4242 4242 4242 4242"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">MM/AA</Label>
                            <Input
                              id="expiry"
                              placeholder="12/28"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input
                              id="cvc"
                              placeholder="123"
                              value={cardDetails.cvc}
                              onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="cardName">Nom sur la carte</Label>
                          <Input
                            id="cardName"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                            required
                          />
                        </div>

                        <p className="text-sm text-muted-foreground">
                          Pour les tests, utilisez le numéro 4242 4242 4242 4242
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep('shipping')} className="flex-1">
                        Retour
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Traitement...
                          </>
                        ) : (
                          `Payer ${formatPrice(total)}`
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 'processing' && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Traitement du paiement...</h3>
                  <p className="text-muted-foreground">
                    Veuillez patienter pendant que nous traitons votre paiement.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Récapitulatif de commande */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantité: {item.quantity} • Format: {item.format}
                        </p>
                      </div>
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <p className="font-bold">Total:</p>
                      <p className="font-bold text-lg">{formatPrice(total)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteCheckout;