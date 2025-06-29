
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Wallet, Phone, Loader2 } from "lucide-react";
import MobileMoneyForm from "./MobileMoneyForm";
import CreditCardForm from "./CreditCardForm";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentOptionsProps {
  amount: number;
  onPaymentSuccess: (paymentMethod: string, transactionId: string) => void;
  onCancel: () => void;
}

const PaymentOptions = ({ amount, onPaymentSuccess, onCancel }: PaymentOptionsProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile_money" | "paypal">("mobile_money");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "validating" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [simulatedNumber, setSimulatedNumber] = useState<string>("");

  const handlePaymentSubmit = async (formData: any) => {
    setIsProcessing(true);
    setPaymentStatus("processing");
    setProgress(0);

    // Simuler l'envoi du paiement
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProgress(30);
    
    if (paymentMethod === "mobile_money") {
      setSimulatedNumber(formData.phoneNumber);
      
      // Simuler l'attente de confirmation mobile
      setPaymentStatus("validating");
      setProgress(50);
      
      // Simuler un délai de validation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Pour la démo, on peut simuler la validation automatiquement
      setProgress(100);
      setPaymentStatus("success");
      
      toast({
        title: "Paiement réussi",
        description: `Un SMS de confirmation a été envoyé au ${formData.phoneNumber}.`,
      });
      
      // Simuler un ID de transaction
      const transactionId = `MM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Attendre un peu pour que l'utilisateur voie le statut de succès
      setTimeout(() => {
        onPaymentSuccess(paymentMethod, transactionId);
      }, 1500);
    } else {
      // Pour les autres méthodes de paiement, simuler un processus plus rapide
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(100);
      setPaymentStatus("success");
      
      const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      toast({
        title: "Paiement réussi",
        description: `Votre paiement de ${amount.toLocaleString()} FCFA a été traité avec succès.`,
      });
      
      // Attendre un peu pour que l'utilisateur voie le statut de succès
      setTimeout(() => {
        onPaymentSuccess(paymentMethod, transactionId);
      }, 1000);
    }
  };

  // Simulation d'annulation ou d'erreur de paiement (pour démo)
  const handleSimulateError = () => {
    setPaymentStatus("error");
    setIsProcessing(false);
    
    toast({
      title: "Erreur de paiement",
      description: "Transaction annulée ou refusée. Veuillez réessayer.",
      variant: "destructive",
    });
  };

  // Simulation de validation manuelle du paiement mobile (pour démo)
  const handleSimulateManualValidation = () => {
    setProgress(100);
    setPaymentStatus("success");
    
    toast({
      title: "Paiement validé manuellement",
      description: `Paiement effectué depuis le numéro ${simulatedNumber}.`,
    });
    
    const transactionId = `MM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    setTimeout(() => {
      onPaymentSuccess(paymentMethod, transactionId);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Options de paiement</CardTitle>
        <CardDescription>
          Choisissez votre méthode de paiement préférée pour valider votre commande.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {paymentStatus === "idle" ? (
          <>
            <RadioGroup
              defaultValue="mobile_money"
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as "card" | "mobile_money" | "paypal")}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 border p-4 rounded-md relative">
                <RadioGroupItem value="mobile_money" id="mobile_money" />
                <Label htmlFor="mobile_money" className="flex items-center gap-3 cursor-pointer">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Mobile Money</p>
                    <p className="text-sm text-muted-foreground">Orange Money, Wave, MTN MoMo</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-md relative">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Carte Bancaire</p>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, etc.</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-md relative">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-3 cursor-pointer">
                  <Wallet className="h-5 w-5 text-blue-700" />
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-muted-foreground">Paiement sécurisé via PayPal</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="mt-6">
              {paymentMethod === "mobile_money" && (
                <MobileMoneyForm onSubmit={handlePaymentSubmit} isProcessing={isProcessing} />
              )}
              {paymentMethod === "card" && (
                <CreditCardForm onSubmit={handlePaymentSubmit} isProcessing={isProcessing} />
              )}
              {paymentMethod === "paypal" && (
                <div className="text-center py-4">
                  <Button 
                    onClick={() => handlePaymentSubmit({ method: "paypal" })}
                    disabled={isProcessing}
                    className="bg-blue-700 hover:bg-blue-800 w-full"
                  >
                    {isProcessing ? "Traitement..." : "Payer avec PayPal"}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vous serez redirigé vers le site de PayPal pour finaliser votre paiement.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-6">
            <div className="mb-6">
              <p className="text-center text-lg font-medium mb-2">
                {paymentStatus === "processing" && "Traitement du paiement..."}
                {paymentStatus === "validating" && "En attente de validation..."}
                {paymentStatus === "success" && "Paiement réussi !"}
                {paymentStatus === "error" && "Erreur de paiement"}
              </p>
              
              <Progress value={progress} className="h-2 mb-2" />
              
              <p className="text-sm text-center text-gray-600">
                {paymentStatus === "processing" && "Veuillez patienter pendant que nous traitons votre paiement"}
                {paymentStatus === "validating" && `Vérifiez votre téléphone (${simulatedNumber}) pour valider le paiement`}
                {paymentStatus === "success" && "Votre paiement a été traité avec succès"}
                {paymentStatus === "error" && "Votre paiement n'a pas pu être traité"}
              </p>
            </div>
            
            {paymentStatus === "validating" && (
              <Alert className="mb-4 bg-yellow-50 border border-yellow-200">
                <AlertDescription className="flex flex-col gap-4">
                  <p>Simulation: En attente de confirmation par Mobile Money</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={handleSimulateManualValidation} 
                      className="bg-green-600 hover:bg-green-700">
                      Simuler validation
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleSimulateError}>
                      Simuler refus
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {paymentStatus === "success" && (
              <div className="text-center text-green-600">
                <p className="text-lg font-semibold">Transaction confirmée</p>
                <p>Merci pour votre achat !</p>
              </div>
            )}
            
            {paymentStatus === "error" && (
              <div className="text-center">
                <Button 
                  onClick={() => setPaymentStatus("idle")} 
                  className="mt-2">
                  Réessayer
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {paymentStatus === "idle" && (
          <>
            <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
              Annuler
            </Button>
            <p className="text-lg font-semibold">
              Total: {amount.toLocaleString()} FCFA
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentOptions;
