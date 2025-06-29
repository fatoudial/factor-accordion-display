
import React from 'react';
import { Book, Heart } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { BookDesign } from '@/types/book';

interface BookPrefacePageProps {
  design: BookDesign;
}

export const BookPrefacePage: React.FC<BookPrefacePageProps> = ({ design }) => {
  const recipientName = design.recipientName || 'Toi';
  const senderName = design.senderName || 'Moi';
  
  // Select preface template based on design
  const renderPreface = () => {
    switch(design.fontStyle) {
      case 'classic':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-serif mb-6">Préface</h2>
            <p className="mb-6 leading-relaxed">
              Chaque message échangé entre {recipientName} et {senderName} est une pierre qui a construit le chemin de notre histoire.
            </p>
            <p className="mb-8 leading-relaxed">
              Ce livre rassemble nos conversations, nos rires partagés, nos moments de complicité, et préserve à jamais cette connexion unique qui nous unit.
            </p>
            <div className="italic text-sm">
              "Les plus belles histoires sont celles écrites à deux."
            </div>
          </div>
        );
      case 'modern':
        return (
          <div className="p-10">
            <div className="flex justify-center mb-8">
              <Book className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center">NOTRE HISTOIRE DIGITALE</h2>
            <p className="mb-6 leading-relaxed">
              Dans un monde où les conversations numériques remplacent souvent les lettres manuscrites, les messages échangés entre {recipientName} et {senderName} prennent une valeur particulière.
            </p>
            <p className="mb-6 leading-relaxed">
              Ces conversations capturées dans ces pages représentent des instants de vie partagés, des émotions échangées, et des liens tissés malgré la distance et le temps.
            </p>
            <p className="text-center italic">
              — Conversations immortalisées —
            </p>
          </div>
        );
      case 'playful':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center" style={{color: design.textColor || '#333'}}>
              Hey! 👋
            </h2>
            <p className="mb-6 leading-relaxed text-lg">
              Tu tiens entre tes mains un morceau de notre histoire! Ces messages entre {recipientName} et {senderName} racontent notre aventure en version numérique.
            </p>
            <div className="flex justify-center mb-6">
              <Heart className="h-8 w-8 text-red-500" fill="currentColor" />
            </div>
            <p className="text-center text-lg">
              Prêt à revivre nos meilleurs moments?
            </p>
          </div>
        );
      case 'minimalist':
        return (
          <div className="p-10">
            <h2 className="text-xl uppercase tracking-widest mb-12 text-center">Préface</h2>
            <p className="mb-10 leading-relaxed">
              Les conversations entre {recipientName} et {senderName}, rassemblées dans ce recueil, témoignent d'une connexion authentique dans l'ère numérique.
            </p>
            <div className="w-12 h-0.5 bg-gray-400 mx-auto mb-10"></div>
            <p className="text-center text-sm tracking-wide uppercase">
              Conversations préservées
            </p>
          </div>
        );
      default:
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-serif mb-6">Préface</h2>
            <p className="mb-6">
              Les messages échangés entre nous forment une histoire unique que ce livre immortalise.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="book-page flex items-center justify-center">
      <div className="max-w-md w-full">
        <AspectRatio ratio={3/4} className="bg-white rounded shadow-sm">
          {renderPreface()}
        </AspectRatio>
      </div>
    </div>
  );
};
