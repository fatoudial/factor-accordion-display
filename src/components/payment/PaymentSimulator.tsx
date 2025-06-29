
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import PaymentOptions from './PaymentOptions';

interface PaymentSimulatorProps {
  amount: number;
  bookId?: number;
  bookTitle?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

enum PaymentStep {
  CHOOSE_METHOD,
  PROCESSING,
  SUCCESS,
  PREVIEW
}

const PaymentSimulator = ({ 
  amount, 
  bookId, 
  bookTitle = "Mon livre souvenir", 
  onSuccess, 
  onCancel 
}: PaymentSimulatorProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<PaymentStep>(PaymentStep.CHOOSE_METHOD);
  const [transactionId, setTransactionId] = useState<string>('');

  const handlePaymentSuccess = (paymentMethod: string, txnId: string) => {
    setTransactionId(txnId);
    setStep(PaymentStep.PROCESSING);
    
    // Simuler le traitement du paiement
    setTimeout(() => {
      setStep(PaymentStep.SUCCESS);
      toast({
        title: t('payment.success'),
        description: `Votre commande #${txnId.slice(-6)} a été validée.`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    }, 2000);
  };
  
  const handlePreviewBook = () => {
    setStep(PaymentStep.PREVIEW);
  };
  
  const handleFinish = () => {
    navigate('/user-orders');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {step === PaymentStep.CHOOSE_METHOD && (
        <PaymentOptions 
          amount={amount} 
          onPaymentSuccess={handlePaymentSuccess} 
          onCancel={onCancel || (() => navigate('/cart'))} 
        />
      )}
      
      {step === PaymentStep.PROCESSING && (
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle>{t('payment.processing')}</CardTitle>
            <CardDescription>Veuillez patienter pendant que nous traitons votre paiement</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-10">
            <Loader2 className="h-16 w-16 text-ts-indigo animate-spin" />
          </CardContent>
        </Card>
      )}
      
      {step === PaymentStep.SUCCESS && (
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-700">{t('payment.success')}</CardTitle>
            <CardDescription>
              Votre commande #{transactionId.slice(-6)} a été validée et est en cours de traitement.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Merci pour votre commande!</p>
            <p className="mb-6">Votre livre <strong>{bookTitle}</strong> sera bientôt prêt.</p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" onClick={handlePreviewBook}>
              Prévisualiser mon livre
            </Button>
            <Button onClick={handleFinish}>
              Voir mes commandes
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {step === PaymentStep.PREVIEW && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Aperçu de votre livre</CardTitle>
            <CardDescription>
              Voici à quoi ressemblera votre livre souvenir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-6 rounded-lg mb-4 aspect-[3/4] flex items-center justify-center">
              <div className="bg-white shadow-lg p-4 rounded w-2/3 aspect-[3/4] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-ts-indigo/20 to-ts-gold/20"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <h3 className="text-xl font-bold mb-2">{bookTitle}</h3>
                  <p className="text-sm text-gray-600">Vos conversations préférées</p>
                  <div className="mt-4 w-16 h-16 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Votre livre est en cours de préparation. Vous recevrez un e-mail lorsqu'il sera prêt à être expédié ou téléchargé.
            </p>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleFinish}>
              Terminer
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default PaymentSimulator;
