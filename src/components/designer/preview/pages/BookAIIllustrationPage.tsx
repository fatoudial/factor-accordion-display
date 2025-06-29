
import React from 'react';
import { Image } from 'lucide-react';
import type { BookDesign } from '@/types/book';

interface BookAIIllustrationPageProps {
  design: BookDesign;
  index: number;
  messageGroupsKeys: string[];
}

export const BookAIIllustrationPage: React.FC<BookAIIllustrationPageProps> = ({ 
  design,
  index,
  messageGroupsKeys
}) => {
  // Utiliser une image placeholder pour la démonstration
  const placeholderImages = [
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&h=500',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&h=500',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&h=500',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=500&h=500'
  ];

  // Sélectionner une image de façon déterministe basée sur l'index
  const imageUrl = placeholderImages[index % placeholderImages.length];

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <h2 className="text-xl mb-4" style={{ color: design.accentColor }}>Illustration générée par IA</h2>
      
      <div className="w-full max-w-md aspect-square border-2 rounded-lg flex flex-col items-center justify-center overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Illustration générée par IA" 
          className="w-full h-full object-cover"
        />
        <p className="text-xs text-gray-400 bg-white/80 absolute bottom-2 px-2 py-1 rounded">
          Basée sur les conversations du {messageGroupsKeys[index % messageGroupsKeys.length]}
        </p>
      </div>
    </div>
  );
};
