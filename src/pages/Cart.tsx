
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    subtotal, 
    shippingCost, 
    total 
  } = useCart();
  
  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: t('cart.empty'),
        description: t('cart.emptyDesc'),
        variant: "destructive",
      });
      return;
    }
    
    // Redirection vers la page de paiement
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-ts-forest">{t('cart.title')}</h1>
      
      {items.length === 0 ? (
        <Card className="text-center py-12 border-ts-gold/20">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <ShoppingCart className="h-16 w-16 text-ts-gold/40" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-ts-forest">{t('cart.empty')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('cart.discover')}
                </p>
                <Button onClick={() => navigate('/#services')} className="bg-ts-forest hover:bg-ts-forest/90 text-white">
                  {t('cart.discoverBtn')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="border-ts-gold/20">
              <CardHeader className="bg-ts-forest/5 rounded-t-lg">
                <CardTitle>{t('cart.items')} ({items.length})</CardTitle>
                <CardDescription>{t('cart.itemsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b last:border-0">
                    <div className="w-full sm:w-auto sm:flex-shrink-0 mb-4 sm:mb-0">
                      <div className="bg-ts-sand/50 w-24 h-24 rounded flex items-center justify-center">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="max-h-full" />
                        ) : (
                          <ShoppingCart className="h-8 w-8 text-ts-gold" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-grow px-4">
                      <h3 className="font-medium text-lg text-ts-forest">{item.title}</h3>
                      <p className="text-sm text-gray-600">{t('cart.format')}: {item.format}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 border-ts-forest/20" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <Input 
                          type="number" 
                          min="1" 
                          value={item.quantity} 
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="h-8 w-12 text-center mx-1 border-ts-forest/20" 
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 border-ts-forest/20"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      
                      <div className="text-right min-w-[80px]">
                        <p className="font-medium text-ts-forest">{item.price.toLocaleString()} FCFA</p>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-ts-terracotta" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="border-ts-gold/20">
              <CardHeader className="bg-ts-forest/5 rounded-t-lg">
                <CardTitle>{t('cart.summary')}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span className="text-ts-forest">{subtotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('cart.shipping')}</span>
                    <span className="text-ts-forest">{shippingCost.toLocaleString()} FCFA</span>
                  </div>
                  <Separator className="border-ts-forest/20" />
                  <div className="flex justify-between font-bold">
                    <span>{t('cart.total')}</span>
                    <span className="text-ts-forest">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-ts-forest hover:bg-ts-forest/90 text-white" 
                  onClick={handleCheckout}
                >
                  {t('cart.checkout')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
