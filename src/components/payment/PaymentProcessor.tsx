import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Smartphone, Wallet, Loader2 } from "lucide-react";
import { backendPaymentApi } from "@/lib/backendPaymentApi";

interface PaymentProcessorProps {
  amount: number;
  orderId: number;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

const PaymentProcessor = ({ amount, orderId, onSuccess, onCancel }: PaymentProcessorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");

  // Mobile Money State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [provider, setProvider] = useState("orange_money");

  // Card State
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer un paiement",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      let paymentData: any = {
        orderId,
        amount,
        method: paymentMethod,
      };

      if (paymentMethod === "mobile_money") {
        if (!phoneNumber) {
          throw new Error("Numéro de téléphone requis");
        }
        paymentData.provider = provider;
        paymentData.phoneNumber = phoneNumber;
      } else if (paymentMethod === "card") {
        if (!cardNumber || !expiryDate || !cvv || !cardName) {
          throw new Error("Tous les champs de la carte sont requis");
        }
        paymentData.cardNumber = cardNumber;
        paymentData.expiryDate = expiryDate;
        paymentData.cvv = cvv;
        paymentData.cardName = cardName;
      }

      const token = localStorage.getItem('authToken') || '';
      const response = await backendPaymentApi.initiatePayment(token, paymentData);

      if (response.success) {
        toast({
          title: "Paiement initié",
          description: response.message,
        });

        // Si c'est un paiement avec redirection (carte, PayPal)
        if (response.payment_url) {
          window.open(response.payment_url, '_blank');
        }

        // Simuler la vérification du statut
        setTimeout(async () => {
          try {
            const statusResponse = await backendPaymentApi.checkPaymentStatus(response.transactionId);
            if (statusResponse.success && statusResponse.status === "SUCCESS") {
              onSuccess(response.transactionId);
            }
          } catch (error) {
            console.error("Erreur lors de la vérification du statut:", error);
          }
        }, 3000);

      } else {
        throw new Error(response.message || "Erreur lors du paiement");
      }

    } catch (error: any) {
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Paiement - {amount.toLocaleString()} FCFA</CardTitle>
        <CardDescription>
          Choisissez votre méthode de paiement préférée
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
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
              <Wallet className="h-4 w-4" />
              PayPal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mobile_money" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Opérateur</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un opérateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orange_money">Orange Money</SelectItem>
                  <SelectItem value="wave">Wave</SelectItem>
                  <SelectItem value="mtn_momo">MTN Mobile Money</SelectItem>
                  <SelectItem value="free_money">Free Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="77 123 45 67"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Nom sur la carte</Label>
              <Input
                id="cardName"
                placeholder="JEAN DUPONT"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Numéro de carte</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Date d'expiration</Label>
                <Input
                  id="expiry"
                  placeholder="MM/AA"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">Code CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="paypal" className="space-y-4">
            <div className="text-center py-8">
              <Wallet className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <p className="text-sm text-muted-foreground">
                Vous serez redirigé vers PayPal pour finaliser votre paiement de manière sécurisée.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Annuler
          </Button>
          <Button onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : (
              `Payer ${amount.toLocaleString()} FCFA`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;