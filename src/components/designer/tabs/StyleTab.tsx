
import React from 'react';
import { StyleSelector } from '@/components/designer/StyleSelector';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ColorSelector } from '@/components/designer/ColorSelector';
import type { BookDesign } from '@/types/book';
import type { BookFormat } from '@/types/book';

interface StyleTabProps {
  design: BookDesign;
  onUpdate: (key: string, value: string | boolean | BookFormat) => void;
  onPreviousTab: () => void;
  onNextTab: () => void;
}

export const StyleTab: React.FC<StyleTabProps> = ({ 
  design, 
  onUpdate, 
  onPreviousTab, 
  onNextTab 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <StyleSelector 
            design={design}
            onUpdate={onUpdate}
          />
        </div>
        <div>
          <ColorSelector
            design={design}
            onUpdate={onUpdate}
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPreviousTab}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        
        <Button 
          onClick={onNextTab}
          className="bg-ts-indigo hover:bg-ts-indigo/90 flex items-center gap-2"
        >
          Voir l'aperçu <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
