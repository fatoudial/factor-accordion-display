
import React from 'react';
import type { BookDesign } from '@/types/book';

interface BookCoverPageProps {
  design: BookDesign;
}

export const BookCoverPage: React.FC<BookCoverPageProps> = ({ design }) => {
  const getFont = () => {
    switch (design.fontStyle) {
      case 'classic': return 'font-serif';
      case 'elegant': return 'font-serif italic';
      case 'playful': return 'font-sans';
      default: return 'font-sans';
    }
  };

  return (
    <div 
      className="aspect-[2/3] w-full max-w-[400px] mx-auto rounded-lg shadow-xl overflow-hidden flex flex-col relative"
      style={{ backgroundColor: design.coverColor }}
    >
      {/* Titre en haut */}
      <div className="p-8 text-center">
        <h2 
          className={`text-3xl font-bold mb-4 ${getFont()}`}
          style={{ color: 'white' }}
        >
          {design.coverTitle}
        </h2>
        <p 
          className={`text-xl ${getFont()}`}
          style={{ color: 'rgba(255, 255, 255, 0.9)' }}
        >
          {design.coverSubtitle}
        </p>
      </div>
      
      {/* Image au centre */}
      {design.coverImage && design.coverImage !== "/placeholder.svg" ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-h-64 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={design.coverImage} 
              alt="Couverture" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full h-48 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center">
            <span className="text-white/60 text-lg">Image de couverture</span>
          </div>
        </div>
      )}
      
      {/* Espace en bas */}
      <div className="p-8"></div>
    </div>
  );
};
