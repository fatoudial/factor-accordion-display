
import { Label } from '@/components/ui/label';

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

interface ColorSelectorProps {
  design: BookDesign;
  onUpdate: (key: string, value: string) => void;
}

export const ColorSelector = ({ design, onUpdate }: ColorSelectorProps) => {
  const predefinedColors = [
    { name: 'Bleu', value: '#3B82F6' },
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Rose', value: '#EC4899' },
    { name: 'Vert', value: '#10B981' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Rouge', value: '#EF4444' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-lg mb-3 block">Couleur de la couverture</Label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {predefinedColors.map((color) => (
            <button
              key={color.value}
              onClick={() => onUpdate('coverColor', color.value)}
              className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                design.coverColor === color.value 
                  ? 'border-gray-900 shadow-md scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div 
                className="w-full h-6 rounded mb-1 shadow-sm" 
                style={{ backgroundColor: color.value }}
              />
              <span className="text-xs font-medium">{color.name}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
          <Label htmlFor="custom-color" className="text-xs font-medium flex-1">
            Couleur personnalisée
          </Label>
          <input 
            type="color" 
            id="custom-color"
            value={design.coverColor || '#3B82F6'}
            onChange={(e) => onUpdate('coverColor', e.target.value)}
            className="w-8 h-8 rounded border-2 border-white shadow-sm cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
