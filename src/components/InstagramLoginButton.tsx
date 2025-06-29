
import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';
import { useInstagramAuth } from '@/hooks/useInstagramAuth';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const InstagramLoginButton = () => {
  const { isConnected, handleInstagramLogin } = useInstagramAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleClick = async () => {
    setIsLoading(true);
    
    try {
      await handleInstagramLogin();
      toast({
        title: "Connexion simulée",
        description: "Mode démonstration activé.",
      });
    } catch (e) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à Instagram pour le moment.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleClick}
      className="flex items-center gap-2"
      disabled={isConnected || isLoading}
    >
      <Instagram className="h-5 w-5" />
      {isLoading ? 'Connexion en cours...' : 
       isConnected ? 'Compte Instagram connecté' : 
       'Connecter mon compte Instagram'}
    </Button>
  );
};
