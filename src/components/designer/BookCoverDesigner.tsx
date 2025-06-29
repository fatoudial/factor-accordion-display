
import { useState } from 'react';
import { FileUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface BookDesign {
  coverTitle: string;
  coverSubtitle: string;
  coverImage: string;
  coverColor: string;
  fontStyle: string;
  textColor: string;
  accentColor: string;
  useAIImages: boolean;
  pageLayout: string;
}

interface BookCoverDesignerProps {
  design: BookDesign;
  onUpdate: (key: string, value: string | boolean) => void;
}

export const BookCoverDesigner = ({ design, onUpdate }: BookCoverDesignerProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        onUpdate('coverImage', result);
        
        if (!design.coverTitle || design.coverTitle === '') {
          onUpdate('coverTitle', 'Nos souvenirs');
        }
        if (!design.coverSubtitle || design.coverSubtitle === '') {
          onUpdate('coverSubtitle', 'Une histoire à nous');
        }
        if (!design.coverColor || design.coverColor === '') {
          onUpdate('coverColor', '#6366f1');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAICover = async () => {
    setIsGeneratingAI(true);
    try {
      console.log("Génération d'une couverture avec IA basée sur:", design.coverTitle);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAiImageUrl = "https://picsum.photos/800/1200";
      setPreviewImage(mockAiImageUrl);
      onUpdate('coverImage', mockAiImageUrl);
      
      if (!design.coverTitle || design.coverTitle === '') {
        onUpdate('coverTitle', 'Nos souvenirs');
      }
      if (!design.coverSubtitle || design.coverSubtitle === '') {
        onUpdate('coverSubtitle', 'Une histoire à nous');
      }
      if (!design.coverColor || design.coverColor === '') {
        onUpdate('coverColor', '#6366f1');
      }
    } finally {
      setIsGeneratingAI(false);
    }
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <Label htmlFor="cover-title">Titre du livre</Label>
          <Input 
            id="cover-title" 
            value={design.coverTitle}
            onChange={(e) => onUpdate('coverTitle', e.target.value)}
            placeholder="Nos souvenirs"
            className="text-lg"
          />
        </div>
        
        <div>
          <Label htmlFor="cover-subtitle">Sous-titre</Label>
          <Input 
            id="cover-subtitle" 
            value={design.coverSubtitle}
            onChange={(e) => onUpdate('coverSubtitle', e.target.value)}
            placeholder="Une histoire à nous"
          />
        </div>
        
        <div>
          <Label htmlFor="cover-color">Couleur de couverture</Label>
          <div className="flex gap-3 items-center">
            <input 
              type="color" 
              id="cover-color"
              value={design.coverColor || '#6366f1'}
              onChange={(e) => onUpdate('coverColor', e.target.value)}
              className="w-10 h-10 rounded border-0"
            />
            <span className="text-sm text-gray-500">{design.coverColor || '#6366f1'}</span>
          </div>
        </div>
        
        <div>
          <Label>Image de couverture</Label>
          <div className="mt-2 space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="cover-image"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="cover-image" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <FileUp className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Télécharger une image
                  </span>
                  <span className="text-xs text-gray-500">
                    JPG, PNG ou GIF - Max 5MB
                  </span>
                </div>
              </label>
            </div>
            
            <div className="text-center">
              <span className="text-sm text-gray-500 inline-block mb-2">ou</span>
              <Button 
                type="button" 
                variant="secondary" 
                className="w-full"
                onClick={handleGenerateAICover}
                disabled={isGeneratingAI}
              >
                {isGeneratingAI ? 'Génération en cours...' : 'Générer une image avec l\'IA'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <Label className="mb-4">Aperçu de la couverture</Label>
        <div 
          className="aspect-[2/3] w-full max-w-[300px] rounded-lg shadow-lg overflow-hidden flex flex-col relative"
          style={{ backgroundColor: design.coverColor || '#6366f1' }}
        >
          <div className="p-4 text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              {design.coverTitle || 'Nos souvenirs'}
            </h2>
            <p className="text-sm text-white/90">
              {design.coverSubtitle || 'Une histoire à nous'}
            </p>
          </div>
          
          {(previewImage || (design.coverImage && design.coverImage !== "/placeholder.svg")) ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="w-full h-48 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={previewImage || design.coverImage} 
                  alt="Couverture" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="w-full h-48 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center">
                <span className="text-white/60 text-sm">Image de couverture</span>
              </div>
            </div>
          )}
          
          <div className="p-4"></div>
        </div>
      </div>
    </div>
  );
};
