
import React from 'react';
import { BookCoverDesigner } from '@/components/designer/BookCoverDesigner';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { BookDesign, BookFormat } from '@/types/book';
import { useIsMobile } from '@/hooks/use-mobile';

interface CoverTabProps {
  design: BookDesign;
  onUpdate: (key: string, value: string | boolean | BookFormat) => void;
  onNextTab: () => void;
}

export const CoverTab: React.FC<CoverTabProps> = ({ design, onUpdate, onNextTab }) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <BookCoverDesigner 
        design={design}
        onUpdate={onUpdate}
      />
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={onNextTab} 
          className="bg-ts-indigo hover:bg-ts-indigo/90 flex items-center gap-2"
        >
          Continuer <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
