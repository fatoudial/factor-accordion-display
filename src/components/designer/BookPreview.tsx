
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Lock } from 'lucide-react';
import type { BookDesign } from '@/types/book';
import type { ProcessedMessage } from '@/components/extractor/types';
import { PageRenderer } from './preview/PageRenderer';
import { PreviewControls } from './preview/PreviewControls';
import { useBookPreview as useBookPreviewHook } from './preview/useBookPreview';
import { useNavigate } from 'react-router-dom';

interface BookPreviewProps {
  design?: BookDesign;
  messages?: ProcessedMessage[];
  isPremiumUser?: boolean;
}

export const BookPreview: React.FC<BookPreviewProps> = ({ 
  design, 
  messages = [], 
  isPremiumUser = false 
}) => {
  const navigate = useNavigate();
  const [fullscreen, setFullscreen] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  
  // Provide default design if not provided
  const defaultDesign: BookDesign = {
    title: '',
    coverTitle: '',
    coverSubtitle: '',
    coverImage: '',
    coverColor: '',
    fontStyle: 'sans-serif',
    textColor: '#000000',
    accentColor: '#0066cc',
    useAIImages: true,
    pageLayout: 'standard',
    messages: [],
    format: 'PRINT_STANDARD'
  };
  
  const bookDesign = design || defaultDesign;
  
  // S'assurer que messages est toujours un tableau
  const safeMessages = Array.isArray(messages) ? messages : [];
  
  // Use the design from useBookPreview hook with correct parameter order
  const { 
    currentPage, 
    totalPages,
    accessiblePages,
    messageGroups,
    messageGroupsKeys,
    nextPage, 
    prevPage,
    isGenerating,
    isBookView,
    isFullscreen,
    toggleFullscreen,
    toggleBookView,
    handleGeneratePreview
  } = useBookPreviewHook(safeMessages, bookDesign, isPremiumUser);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreen) {
        if (e.key === 'ArrowRight') {
          nextPage();
        } else if (e.key === 'ArrowLeft') {
          prevPage();
        } else if (e.key === 'Escape') {
          setFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen, nextPage, prevPage]);
  
  const bookStyle = {
    fontFamily: bookDesign.fontStyle === 'classic' ? 'serif' : 'sans-serif',
    backgroundColor: bookDesign.bubbleColors?.background || '#ffffff',
    color: bookDesign.textColor || '#333333',
  };
  
  const handleViewOffers = () => {
    navigate('/offers', { 
      state: { 
        fromPreview: true,
        bookFormat: bookDesign.format || 'standard'
      } 
    });
  };

  return (
    <div className="bg-white">
      <div className="space-y-6">
        <PreviewControls
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          onToggleBookView={toggleBookView}
          onToggleFullscreen={toggleFullscreen}
          isBookView={isBookView}
          isFullscreen={isFullscreen}
          isGenerating={isGenerating}
          onGeneratePreview={handleGeneratePreview}
        />
        
        <div ref={bookRef} style={bookStyle} className="relative">
          <PageRenderer
            messageGroups={messageGroups}
            messageGroupsKeys={messageGroupsKeys}
            currentPage={currentPage}
            design={bookDesign}
            isPremiumUser={isPremiumUser}
            accessiblePages={accessiblePages}
          />
        </div>
        
        {!isPremiumUser && currentPage > 2 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-4">Aperçu limité</h3>
              <p className="text-gray-600 mb-6">
                Commandez votre livre pour voir l'aperçu complet
              </p>
              <Button onClick={handleViewOffers} className="w-full">
                Voir les offres
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPreview;
