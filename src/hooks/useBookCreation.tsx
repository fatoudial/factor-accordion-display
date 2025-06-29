
import { useState } from 'react';
import { booksApi, type BookStatus } from '@/lib/api';
import type { BookDesign } from '@/types/book';
import { useToast } from '@/hooks/use-toast';

export function useBookCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const [bookId, setBookId] = useState<number | null>(null);
  const [bookStatus, setBookStatus] = useState<BookStatus | null>(null);
  const { toast } = useToast();

  const createBook = async (design: BookDesign) => {
    setIsCreating(true);
    try {
      const response = await booksApi.createBook(design);
      setBookId(response.id);
      setBookStatus({ id: response.id, status: 'PROCESSING', progress: 0 });
      
      toast({
        title: "Création du livre lancée",
        description: "Vous pouvez suivre la progression dans votre espace client."
      });
      
      // Commencer à surveiller la progression
      startPollingStatus(response.id);
      return response;
    } catch (error) {
      toast({
        title: "Erreur de création",
        description: "Impossible de créer le livre. Veuillez réessayer.",
        variant: "destructive"
      });
      console.error("Error creating book:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const cancelBookCreation = async () => {
    if (!bookId) return;
    
    try {
      await booksApi.cancelBook(bookId);
      setBookStatus(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
      toast({
        title: "Création annulée",
        description: "La génération de votre livre a été annulée."
      });
    } catch (error) {
      toast({
        title: "Erreur d'annulation",
        description: "Impossible d'annuler la création. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const startPollingStatus = (id: number) => {
    const interval = setInterval(async () => {
      try {
        const status = await booksApi.getBookStatus(id);
        setBookStatus(status);
        
        // Arrêter le polling si le livre est terminé ou annulé
        if (['COMPLETED', 'CANCELLED', 'FAILED'].includes(status.status)) {
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error polling book status:", error);
        clearInterval(interval);
      }
    }, 3000); // Vérifier toutes les 3 secondes
    
    // Nettoyer l'intervalle en cas de démontage du composant
    return () => clearInterval(interval);
  };

  return {
    isCreating,
    bookId,
    bookStatus,
    createBook,
    cancelBookCreation
  };
}
