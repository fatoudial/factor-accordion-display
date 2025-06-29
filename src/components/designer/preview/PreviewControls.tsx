
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BookOpen, Eye, Lock, ShoppingCart } from 'lucide-react';

interface PreviewControlsProps {
  currentPage: number;
  totalPages: number;
  isFullscreen: boolean;
  isGenerating: boolean;
  isBookView: boolean;
  isPremiumUser?: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onToggleFullscreen: () => void;
  onToggleBookView: () => void;
  onGeneratePreview: () => void;
  onViewOffers?: () => void;
}

export const PreviewControls: React.FC<PreviewControlsProps> = ({
  currentPage,
  totalPages,
  isFullscreen,
  isGenerating,
  isBookView,
  isPremiumUser = false,
  onPrevPage,
  onNextPage,
  onToggleFullscreen,
  onToggleBookView,
  onGeneratePreview,
  onViewOffers
}) => {
  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPrevPage}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Précédent
        </Button>
        <span className="text-sm text-gray-500">
          Page {currentPage + 1} sur {totalPages} {!isPremiumUser && "(aperçu)"}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextPage}
          disabled={currentPage === totalPages - 1}
        >
          Suivant <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? "Quitter le mode plein écran" : "Mode plein écran"}
        </Button>
        
        <Button
          variant={isBookView ? "default" : "outline"}
          size="sm"
          onClick={onToggleBookView}
          className={isBookView ? "bg-ts-indigo hover:bg-ts-indigo/90" : ""}
        >
          <Eye className="h-4 w-4 mr-2" />
          {isBookView ? "Quitter le mode livre" : "Mode livre"}
        </Button>
        
        <Button
          variant="default"
          size="sm"
          className="bg-ts-indigo hover:bg-ts-indigo/90"
          onClick={onGeneratePreview}
          disabled={isGenerating}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          {isGenerating ? "Génération en cours..." : "Générer aperçu complet"}
        </Button>
      </div>
      
      <div className="flex justify-center mb-4">
        {isPremiumUser ? (
          <Button
            variant="outline"
            size="sm"
            className="text-ts-indigo border-ts-indigo"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={true}
              className="text-red-500 border-red-200 mr-3"
            >
              <Lock className="h-4 w-4 mr-2" />
              Télécharger (Achat requis)
            </Button>
            
            {onViewOffers && (
              <Button
                variant="default"
                size="sm"
                onClick={onViewOffers}
                className="bg-ts-indigo hover:bg-ts-indigo/90"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Voir les offres
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
};
