import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BookPreview } from "../BookPreview";
import { useBookDesigner } from "@/hooks/useBookDesigner";
import { BookFormat } from "@/types/book";
import { ProcessedMessage } from '@/components/extractor/types';

interface PreviewTabProps {
  onNext: () => void;
  onBack: () => void;
}

export const PreviewTab = ({ onNext, onBack }: PreviewTabProps) => {
  const [showFormatSelector, setShowFormatSelector] = useState(true);
  const { bookDesign, updateDesign, messages, isPremiumUser } = useBookDesigner();
  
  const bookFormats = [
    { id: "STANDARD", label: "Standard (15 x 21 cm)", price: "29.99€" },
    { id: "LARGE", label: "Grand Format (21 x 29.7 cm)", price: "39.99€" },
    { id: "POCKET", label: "Format Poche (10.5 x 17.5 cm)", price: "24.99€" },
    { id: "SQUARE", label: "Format Carré (21 x 21 cm)", price: "34.99€" },
    { id: "EBOOK", label: "eBook (Format numérique)", price: "14.99€" },
  ];
  
  const handleViewBook = () => {
    setShowFormatSelector(false);
  };

  const handleBackToFormats = () => {
    setShowFormatSelector(true);
  };
  
  const handleFormatSelect = (format: BookFormat) => {
    updateDesign({
      ...bookDesign,
      format
    });
  };
  
  const handleOrder = () => {
    onNext();
  };
  
  if (showFormatSelector) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-medium text-center mb-6">Choisissez le format de votre livre</h2>
        
        <RadioGroup
          defaultValue={bookDesign.format || "STANDARD"}
          onValueChange={(value) => handleFormatSelect(value as BookFormat)}
          className="space-y-3 mb-6"
        >
          {bookFormats.map((format) => (
            <div key={format.id} className="flex items-center">
              <RadioGroupItem value={format.id} id={`format-${format.id}`} />
              <Label htmlFor={`format-${format.id}`} className="flex justify-between w-full ml-3 cursor-pointer">
                <span>{format.label}</span>
                <span className="font-medium">{format.price}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> Le prix final peut varier en fonction du nombre de pages et des options choisies.
              Les formats physiques incluent une couverture rigide et du papier de qualité supérieure.
            </p>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            type="button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          
          <Button 
            onClick={handleViewBook}
            type="button"
          >
            Visualiser
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={handleBackToFormats}
          type="button"
          size="sm"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Formats
        </Button>
        
        <h2 className="text-2xl font-medium">Aperçu de votre livre</h2>
        <p className="text-gray-600">Format: {
          bookFormats.find(f => f.id === bookDesign.format)?.label || "Standard"
        }</p>
      </div>
      
      <BookPreview 
        design={bookDesign}
        messages={messages as ProcessedMessage[]}
        isPremiumUser={isPremiumUser}
      />
      
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <Button 
          onClick={handleOrder}
          type="button"
          className="bg-ts-indigo hover:bg-ts-indigo/90"
        >
          Commander
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
