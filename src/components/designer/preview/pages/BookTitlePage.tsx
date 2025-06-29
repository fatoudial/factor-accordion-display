
import React from 'react';
import type { BookDesign } from '@/types/book';

interface BookTitlePageProps {
  design: BookDesign;
}

export const BookTitlePage: React.FC<BookTitlePageProps> = ({ design }) => {
  const getFont = () => {
    switch (design.fontStyle) {
      case 'classic': return 'font-serif';
      case 'elegant': return 'font-serif italic';
      case 'playful': return 'font-sans';
      default: return 'font-sans';
    }
  };

  return (
    <div className={`p-8 text-center ${getFont()}`}>
      <h1 className="text-2xl mb-8" style={{ color: design.accentColor }}>
        {design.coverTitle}
      </h1>
      <p className="italic mb-4" style={{ color: design.textColor }}>
        Une collection de conversations et souvenirs numériques
      </p>
      <div className="my-12 h-px" style={{ backgroundColor: design.accentColor + '40' }}></div>
      <p className="mt-16" style={{ color: design.textColor }}>
        Ce livre appartient à
      </p>
      <p className="mt-4 text-lg font-bold" style={{ color: design.textColor }}>
        ____________________
      </p>
    </div>
  );
};
