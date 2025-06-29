
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NavigationHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')} 
        className="flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à l'accueil
      </Button>
      
      <h1 className="text-3xl md:text-4xl font-serif font-semibold text-ts-indigo text-center">
        Personnalisez votre livre souvenir
      </h1>
      
      <div className="w-[100px]"></div> {/* Élément invisible pour équilibrer le flex */}
    </div>
  );
};
