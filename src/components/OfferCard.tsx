
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BookFormat } from '@/types/book';

interface OfferCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  actionText: string;
  popular?: boolean;
  bookFormat: BookFormat;
  bookId?: number;
  fromPreview?: boolean;
}

const OfferCard = ({ 
  title, 
  price, 
  description, 
  features, 
  actionText, 
  popular = false, 
  bookFormat, 
  bookId,
  fromPreview = false 
}: OfferCardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showPrice, setShowPrice] = useState(false);

  const handleActionClick = () => {
    // Afficher le prix sur l'interface
    setShowPrice(true);

    // Attendre un peu avant de rediriger pour que l'utilisateur voie le prix
    setTimeout(() => {
      if (isAuthenticated) {
        // Rediriger directement vers checkout avec les informations nécessaires
        navigate('/checkout', { 
          state: { 
            bookId: bookId || Date.now(), // Générer un ID temporaire si pas fourni
            bookFormat: bookFormat,
            price: price,
            fromOffers: true
          } 
        });
      } else {
        // Rediriger vers la page de connexion avec redirection vers checkout
        navigate('/login', { 
          state: { 
            redirectAfterLogin: '/checkout',
            selectedOffer: bookFormat,
            bookId: bookId || Date.now(),
            price: price
          } 
        });
      }
    }, 1500);
  };
  
  return (
    <Card className={`h-full flex flex-col transition-all duration-300 ${popular ? 'border-ts-gold shadow-lg relative' : ''} ${showPrice ? 'ring-2 ring-blue-500' : ''}`}>
      {popular && (
        <Badge className="absolute top-4 right-4 bg-ts-gold text-white">Populaire</Badge>
      )}
      <CardHeader>
        <CardTitle className="text-xl font-serif">{title}</CardTitle>
        {showPrice && (
          <div className="flex items-baseline mt-2 animate-in fade-in duration-500">
            <span className="text-3xl font-bold text-blue-600">{price}</span>
            <span className="ml-1 text-gray-600">FCFA</span>
          </div>
        )}
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button 
          onClick={handleActionClick}
          disabled={showPrice}
          className={`w-full transition-all duration-300 ${
            popular ? 'bg-ts-gold hover:bg-ts-gold/90' : ''
          } ${
            showPrice ? 'bg-blue-600 text-white' : ''
          }`}
        >
          {showPrice ? 
            'Redirection en cours...' : 
            (fromPreview ? "Commander maintenant" : actionText)
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OfferCard;
