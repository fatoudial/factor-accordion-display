
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import OrderSummary from '@/components/checkout/OrderSummary';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentSimulator from '@/components/payment/PaymentSimulator';
import PaymentProcessor from '@/components/payment/PaymentProcessor';
import { booksApi } from '@/lib/api';
import { BookFormat } from '@/types/book';

enum CheckoutStep {
  SHIPPING = 'shipping',
  PAYMENT = 'payment',
  CONFIRMATION = 'confirmation'
}

interface CheckoutState {
  bookId: number;
  bookFormat: BookFormat;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.SHIPPING);
  const [bookInfo, setBookInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingData, setShippingData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Sénégal'
  });
  
  // Récupérer les informations du livre à partir de l'état de location
  const locationState = location.state as CheckoutState | null;
  
  useEffect(() => {
    if (!locationState?.bookId) {
      toast({
        title: "Erreur",
        description: "Informations de commande manquantes. Veuillez recommencer.",
        variant: "destructive"
      });
      navigate('/cart');
      return;
    }

    const fetchBookInfo = async () => {
      setIsLoading(true);
      try {
        // Simuler la récupération d'informations sur le livre
        // Dans une vraie application, cela serait un appel API
        const bookFormatInfo = {
          EBOOK: { 
            price: 5000, 
            title: "Édition Numérique",
            deliveryMethod: "digital" 
          },
          PRINT_STANDARD: { 
            price: 15000, 
            title: "Édition Imprimée",
            deliveryMethod: "physical" 
          },
          PRINT_PREMIUM: { 
            price: 25000, 
            title: "Édition Premium",
            deliveryMethod: "physical" 
          }
        };

        const format = locationState.bookFormat || 'PRINT_STANDARD';
        
        // Simuler une attente pour l'appel API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setBookInfo({
          id: locationState.bookId,
          title: "Mon livre souvenir",
          format: format,
          ...bookFormatInfo[format],
        });
      } catch (error) {
        console.error('Error fetching book info:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les informations du livre",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookInfo();
  }, [locationState, navigate, toast]);

  // Redirection si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { redirectAfterLogin: '/checkout', locationState } 
      });
    }
  }, [isAuthenticated, navigate, locationState]);

  // Gérer le changement d'étape
  const handleNextStep = () => {
    if (currentStep === CheckoutStep.SHIPPING) {
      setCurrentStep(CheckoutStep.PAYMENT);
    } else if (currentStep === CheckoutStep.PAYMENT) {
      setCurrentStep(CheckoutStep.CONFIRMATION);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === CheckoutStep.PAYMENT) {
      setCurrentStep(CheckoutStep.SHIPPING);
    } else if (currentStep === CheckoutStep.CONFIRMATION) {
      setCurrentStep(CheckoutStep.PAYMENT);
    }
  };

  const handleShippingSubmit = (data: any) => {
    setShippingData(data);
    handleNextStep();
  };

  const handlePaymentSuccess = (paymentMethod: string, transactionId: string) => {
    // Dans une vraie application, on enregistrerait la commande dans la base de données
    console.log('Payment successful', { paymentMethod, transactionId, shippingData });
    handleNextStep();
  };

  if (isLoading || !bookInfo) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <p>Chargement des informations de commande...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger 
                value={CheckoutStep.SHIPPING} 
                disabled={currentStep !== CheckoutStep.SHIPPING}
              >
                Livraison
              </TabsTrigger>
              <TabsTrigger 
                value={CheckoutStep.PAYMENT} 
                disabled={currentStep !== CheckoutStep.PAYMENT}
              >
                Paiement
              </TabsTrigger>
              <TabsTrigger 
                value={CheckoutStep.CONFIRMATION} 
                disabled={currentStep !== CheckoutStep.CONFIRMATION}
              >
                Confirmation
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={CheckoutStep.SHIPPING} className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de livraison</CardTitle>
                  <CardDescription>
                    {bookInfo.deliveryMethod === 'digital' 
                      ? "Renseignez vos coordonnées pour recevoir votre livre numérique par email." 
                      : "Renseignez votre adresse de livraison pour recevoir votre livre."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ShippingForm 
                    initialData={shippingData}
                    onSubmit={handleShippingSubmit}
                    isDigitalDelivery={bookInfo.deliveryMethod === 'digital'}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value={CheckoutStep.PAYMENT} className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Paiement</CardTitle>
                  <CardDescription>
                    Choisissez votre mode de paiement préféré.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentProcessor 
                    amount={bookInfo.price} 
                    orderId={bookInfo.id}
                    onSuccess={(transactionId) => {
                      console.log('Payment success:', transactionId);
                      handleNextStep();
                    }}
                    onCancel={handlePreviousStep}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value={CheckoutStep.CONFIRMATION} className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Confirmation de commande</CardTitle>
                  <CardDescription>
                    Votre commande a été traitée avec succès.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                    <h3 className="text-xl font-semibold text-green-700 mb-2">
                      Commande confirmée
                    </h3>
                    <p className="text-green-600">
                      Un email de confirmation vous a été envoyé à {shippingData.email}
                    </p>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Récapitulatif de la commande</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-600">Produit:</p>
                      <p>{bookInfo.title} - {bookInfo.format}</p>
                      
                      <p className="text-gray-600">Livraison:</p>
                      <p>{bookInfo.deliveryMethod === 'digital' ? 'Email' : 'Standard (5-7 jours)'}</p>
                      
                      <p className="text-gray-600">Adresse:</p>
                      <p>
                        {bookInfo.deliveryMethod === 'digital' 
                          ? shippingData.email
                          : `${shippingData.address}, ${shippingData.city}, ${shippingData.country}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button onClick={() => navigate('/user-orders')}>
                      Voir mes commandes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-full lg:w-1/3">
          <OrderSummary 
            items={[{
              id: bookInfo.id.toString(),
              name: bookInfo.title,
              description: bookInfo.format.replace('_', ' '),
              price: bookInfo.price,
              quantity: 1,
              image: '/placeholder.svg'
            }]}
            shippingCost={bookInfo.deliveryMethod === 'digital' ? 0 : 1000}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
