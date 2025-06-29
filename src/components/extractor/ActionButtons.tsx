
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Filter, Save, Download, Printer, BookOpen } from 'lucide-react';
import type { ProcessedMessage } from '@/utils/fileProcessing';

interface ActionButtonsProps {
  processedMessages: ProcessedMessage[];
}

export const ActionButtons = ({ processedMessages }: ActionButtonsProps) => {
  const navigate = useNavigate();
  
  const handleDesignBook = () => {
    navigate('/designer', { state: { messages: processedMessages } });
  };

  return (
    <div className="pt-6 border-t border-gray-200">
      <div className="flex flex-wrap gap-4 justify-center">
        <Button className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Visualiser l'aperçu
        </Button>
        
        <Button className="flex items-center gap-2" variant="outline">
          <Save className="h-4 w-4" />
          Sauvegarder les réglages
        </Button>
        
        <Button className="flex items-center gap-2" variant="secondary">
          <Download className="h-4 w-4" />
          Exporter en PDF
        </Button>
        
        <Button className="flex items-center gap-2" variant="secondary">
          <Printer className="h-4 w-4" />
          Version imprimable
        </Button>
        
        <Button 
          className="flex items-center gap-2 bg-ts-indigo hover:bg-ts-indigo/90" 
          onClick={handleDesignBook}
          disabled={processedMessages.length === 0}
        >
          <BookOpen className="h-4 w-4" />
          Créer mon livre
        </Button>
      </div>
    </div>
  );
};
