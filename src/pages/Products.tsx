import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { productService } from '@/lib/supabaseServices';
import ProductCard from '@/components/ProductCard';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  format: string;
  pages: number;
  cover_style: string;
  is_active: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, formatFilter, priceFilter]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filtre de recherche
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par format
    if (formatFilter !== 'all') {
      filtered = filtered.filter(product => product.format === formatFilter);
    }

    // Filtre par prix
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'low':
          filtered = filtered.filter(product => product.price < 15000);
          break;
        case 'medium':
          filtered = filtered.filter(product => product.price >= 15000 && product.price < 25000);
          break;
        case 'high':
          filtered = filtered.filter(product => product.price >= 25000);
          break;
      }
    }

    setFilteredProducts(filtered);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Chargement des produits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Nos Produits</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Découvrez notre gamme de livres souvenirs personnalisés pour immortaliser vos conversations
        </p>
      </div>

      {/* Filtres */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
          <CardDescription>
            Affinez votre recherche pour trouver le produit parfait
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les formats</SelectItem>
                <SelectItem value="STANDARD">Standard</SelectItem>
                <SelectItem value="PREMIUM">Premium</SelectItem>
                <SelectItem value="DELUXE">Deluxe</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les prix</SelectItem>
                <SelectItem value="low">Moins de 15 000 FCFA</SelectItem>
                <SelectItem value="medium">15 000 - 25 000 FCFA</SelectItem>
                <SelectItem value="high">Plus de 25 000 FCFA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
        </p>
        {filteredProducts.length > 0 && (
          <Button variant="outline" onClick={() => navigate('/cart')}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Voir le panier
          </Button>
        )}
      </div>

      {/* Grille de produits */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || formatFilter !== 'all' || priceFilter !== 'all'
                ? "Essayez de modifier vos critères de recherche"
                : "Aucun produit n'est disponible pour le moment"
              }
            </p>
            {(searchQuery || formatFilter !== 'all' || priceFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFormatFilter('all');
                  setPriceFilter('all');
                }}
              >
                Réinitialiser les filtres
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              price={product.price}
              format={product.format}
              pages={product.pages}
              coverStyle={product.cover_style}
              isPopular={index < 2} // Les 2 premiers sont populaires
              estimatedDays={product.format === 'DELUXE' ? 7 : 5}
            />
          ))}
        </div>
      )}

      {/* Call to action */}
      <Card className="mt-12">
        <CardContent className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Besoin d'aide pour choisir ?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Notre équipe est là pour vous accompagner dans le choix du format parfait pour votre livre souvenir.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/contact')}>
              Nous contacter
            </Button>
            <Button variant="outline" onClick={() => navigate('/designer')}>
              Créer un livre personnalisé
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;