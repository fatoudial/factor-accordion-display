
import { useState } from 'react';
import { ProcessedMessage } from '@/components/extractor/types';
import { BookDesign } from '@/types/book';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export const useBookDesigner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ProcessedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookDesign, setBookDesign] = useState<BookDesign>({
    title: '',
    coverTitle: '',
    coverSubtitle: '',
    coverImage: '',
    coverColor: '',
    fontStyle: 'sans-serif',
    textColor: '#000000',
    accentColor: '#0066cc',
    useAIImages: true,
    pageLayout: 'standard',
    messages: [],
    format: 'PRINT_STANDARD'
  });
  const [bookId, setBookId] = useState<string | null>(null);
  const [isPremiumUser] = useState(false);

  const processMessages = (newMessages: ProcessedMessage[]) => {
    setIsLoading(true);
    setMessages(newMessages);
    setIsLoading(false);
  };

  const updateDesign = (updates: Partial<BookDesign>) => {
    setBookDesign(prev => ({ ...prev, ...updates }));
  };

  const handleSaveDesign = async () => {
    setIsLoading(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newBookId = Math.random().toString(36).substr(2, 9);
      setBookId(newBookId);
      toast({
        title: "Design sauvegardé",
        description: "Votre design de livre a été sauvegardé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le design.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderBook = () => {
    navigate('/offers', { state: { fromPreview: true, bookId } });
  };

  return {
    messages,
    isLoading,
    processMessages,
    bookDesign,
    updateDesign,
    setMessages: processMessages,
    bookId,
    isPremiumUser,
    handleSaveDesign,
    handleOrderBook,
  };
};
