
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useInstagramAuth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInstagramLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulation d'une connexion réussie avec délai pour montrer le chargement
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsConnected(true);
      
      toast({
        title: "Connexion Instagram réussie",
        description: "Vos messages Instagram sont maintenant disponibles.",
      });
      
      // Rediriger vers la page d'upload après la connexion réussie
      navigate('/designer/upload');
    } catch (err) {
      setError("Erreur de connexion à Instagram. Veuillez réessayer.");
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à Instagram. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    handleInstagramLogin,
    error
  };
};
