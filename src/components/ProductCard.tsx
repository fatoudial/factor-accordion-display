import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  format: string;
  pages?: number;
  coverStyle?: string;
  imageUrl?: string;
  isPopular?: boolean;
  estimatedDays?: number;
}

const ProductCard = ({ 
  id, 
  title, 
  description, 
  price, 
  format, 
  pages = 20,
  coverStyle = 'modern',
  imageUrl,
  isPopular = false,
  estimatedDays = 5
}: ProductCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      await addItem({
        id,
        title,
        description,
        price,
        format: format as any,
        quantity: 1,
        imageUrl
      });

      toast({
        title: "Ajouté au panier",
        description: `${title} a été ajouté à votre panier`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'article au panier",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="relative overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      {isPopular && (
        <Badge className="absolute top-2 right-2 z-10" variant="default">
          <Star className="w-3 h-3 mr-1" />
          Populaire
        </Badge>
      )}
      
      <CardHeader className="pb-3">
        <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aperçu du livre</p>
            </div>
          )}
        </div>
        
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3 flex-grow">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Format</span>
            <Badge variant="outline">{format}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Pages</span>
            <span className="text-sm font-medium">{pages}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Style de couverture</span>
            <span className="text-sm font-medium capitalize">{coverStyle}</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Livraison en {estimatedDays} jours</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 flex-col gap-3">
        <div className="w-full flex justify-between items-center">
          <span className="text-2xl font-bold">{price.toLocaleString()} FCFA</span>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Ajout...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Ajouter au panier
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;