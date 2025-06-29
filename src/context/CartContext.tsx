
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { BookFormat } from '@/types/book';

// Type pour un élément du panier
export interface CartItem {
  id: string;
  title: string;
  format: BookFormat;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  itemsCount: number;
  subtotal: number;
  total: number;
  shippingCost: number;
}

const CartContext = createContext<CartContextType | null>(null);

// Format du prix selon un format spécifique
const formatPrice = (format: BookFormat): number => {
  switch (format) {
    case 'EBOOK':
      return 5000;
    case 'PRINT_STANDARD':
      return 15000;
    case 'PRINT_PREMIUM':
      return 25000;
    default:
      return 15000;
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  // Charger le panier depuis localStorage au chargement initial
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'id' | 'quantity'>) => {
    // Générer un ID unique
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculer le prix en fonction du format
    const price = formatPrice(item.format);
    
    setItems(prevItems => {
      // Vérifier si un article similaire existe déjà
      const existingItemIndex = prevItems.findIndex(
        i => i.title === item.title && i.format === item.format
      );
      
      if (existingItemIndex >= 0) {
        // Si l'article existe, incrémenter sa quantité
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      } else {
        // Sinon, ajouter un nouvel article
        return [...prevItems, { ...item, id, price, quantity: 1 }];
      }
    });

    toast({
      title: "Article ajouté au panier",
      description: `${item.title} a été ajouté à votre panier`,
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      title: "Article retiré",
      description: "L'article a été retiré de votre panier",
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Panier vidé",
      description: "Tous les articles ont été retirés de votre panier",
    });
  };
  
  // Calcul des montants
  const itemsCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 0 ? 2000 : 0; // Frais de livraison
  const total = subtotal + shippingCost;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemsCount,
        subtotal,
        total,
        shippingCost
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
