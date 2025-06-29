
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Grid } from "@/components/ui/grid";
import { Loader2, CreditCard } from "lucide-react";

interface CreditCardFormProps {
  onSubmit: (data: any) => void;
  isProcessing: boolean;
}

const CreditCardForm = ({ onSubmit, isProcessing }: CreditCardFormProps) => {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: ""
  });

  const [errors, setErrors] = useState({
    number: false,
    name: false,
    expiry: false,
    cvc: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === "number" && !isProcessing) {
      formattedValue = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      formattedValue = formattedValue.substring(0, 19); // 16 digits + 3 spaces
    }
    
    // Format expiry date as MM/YY
    if (name === "expiry" && !isProcessing) {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.substring(0, 2)}/${formattedValue.substring(2, 4)}`;
      }
    }
    
    // Limit CVC to 3-4 digits
    if (name === "cvc" && !isProcessing) {
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }
    
    setCardData({
      ...cardData,
      [name]: formattedValue
    });
  };

  const validateForm = () => {
    const newErrors = {
      number: cardData.number.replace(/\s/g, "").length !== 16,
      name: cardData.name.length < 3,
      expiry: !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiry),
      cvc: cardData.cvc.length < 3
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        method: "card",
        ...cardData
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="number">Numéro de carte</Label>
        <div className="relative">
          <Input
            id="number"
            name="number"
            placeholder="1234 5678 9012 3456"
            value={cardData.number}
            onChange={handleChange}
            disabled={isProcessing}
            className={`pl-10 ${errors.number && cardData.number ? 'border-red-500' : ''}`}
            maxLength={19}
          />
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {errors.number && cardData.number && (
          <p className="text-red-500 text-sm">Numéro de carte invalide</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nom sur la carte</Label>
        <Input
          id="name"
          name="name"
          placeholder="NOM PRÉNOM"
          value={cardData.name}
          onChange={handleChange}
          disabled={isProcessing}
          className={errors.name && cardData.name ? 'border-red-500' : ''}
        />
        {errors.name && cardData.name && (
          <p className="text-red-500 text-sm">Nom invalide</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Date d'expiration</Label>
          <Input
            id="expiry"
            name="expiry"
            placeholder="MM/YY"
            value={cardData.expiry}
            onChange={handleChange}
            disabled={isProcessing}
            className={errors.expiry && cardData.expiry ? 'border-red-500' : ''}
          />
          {errors.expiry && cardData.expiry && (
            <p className="text-red-500 text-sm">Format: MM/YY</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            name="cvc"
            type="text"
            placeholder="123"
            value={cardData.cvc}
            onChange={handleChange}
            disabled={isProcessing}
            className={errors.cvc && cardData.cvc ? 'border-red-500' : ''}
            maxLength={4}
          />
          {errors.cvc && cardData.cvc && (
            <p className="text-red-500 text-sm">Code invalide</p>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          "Payer maintenant"
        )}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Les transactions sont sécurisées et chiffrées.
      </p>
    </form>
  );
};

export default CreditCardForm;
