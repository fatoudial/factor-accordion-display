
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface MobileMoneyFormProps {
  onSubmit: (data: any) => void;
  isProcessing: boolean;
}

const MobileMoneyForm = ({ onSubmit, isProcessing }: MobileMoneyFormProps) => {
  const [provider, setProvider] = useState("orange");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validatePhoneNumber = (number: string) => {
    // Simple validation: must be between 8-12 digits
    const isValidNumber = /^\d{8,12}$/.test(number);
    setIsValid(isValidNumber);
    return isValidNumber;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePhoneNumber(phoneNumber)) {
      onSubmit({
        method: "mobile_money",
        provider,
        phoneNumber,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="provider">Choisissez votre opérateur</Label>
        <Select 
          value={provider} 
          onValueChange={setProvider}
        >
          <SelectTrigger id="provider" disabled={isProcessing}>
            <SelectValue placeholder="Sélectionnez un opérateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="orange">Orange Money</SelectItem>
            <SelectItem value="wave">Wave</SelectItem>
            <SelectItem value="mtn">MTN Mobile Money</SelectItem>
            <SelectItem value="moov">Moov Money</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Exemple: 01234567"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            validatePhoneNumber(e.target.value);
          }}
          disabled={isProcessing}
        />
        {phoneNumber && !isValid && (
          <p className="text-red-500 text-sm">Numéro de téléphone invalide</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={!isValid || isProcessing}
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
        Une demande de confirmation sera envoyée à votre téléphone.
      </p>
    </form>
  );
};

export default MobileMoneyForm;
