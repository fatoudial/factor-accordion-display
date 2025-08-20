
import React, { useState, useEffect } from 'react';
import FileUploader from '@/components/designer/FileUploader';
import { Button } from '@/components/ui/button';
import { NavigationHeader } from '@/components/designer/NavigationHeader';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import BookCreationStatus from '@/components/designer/BookCreationStatus';
import NavigationBackButton from '@/components/NavigationBackButton';
import BookDownloadManager from '@/components/admin/BookDownloadManager';
import { ProcessedMessage } from '@/components/extractor/types';

interface FileUploaderTabProps {
  onNext?: () => void;
}

const FileUploaderPage: React.FC<FileUploaderTabProps> = ({ onNext }) => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [creationStatus, setCreationStatus] = useState<"processing" | "completed">("processing");
  const [messageCount, setMessageCount] = useState(0);
  const navigate = useNavigate();

  const handleMessagesProcessed = (messages: ProcessedMessage[]) => {
    console.log('Messages processed:', messages.length);
    setIsUploaded(true);
    setIsProcessing(true);
    setMessageCount(messages.length);

    // Stockage des messages dans sessionStorage pour les récupérer sur la page suivante
    sessionStorage.setItem('extractedMessages', JSON.stringify(messages));

    // Simulate progress - Accéléré pour permettre une transition plus rapide
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 20; // Plus rapide (20% à la fois)
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setCreationStatus("completed");
            
            // Navigation plus rapide vers l'étape suivante
            setTimeout(() => {
              if (onNext) {
                onNext();
              } else {
                navigate('/designer/book', { state: { extractedMessages: messages } });
              }
            }, 500); // Réduit à 500ms
          }, 300); // Réduit à 300ms
        }
        
        return newProgress < 100 ? newProgress : 100;
      });
    }, 100); // Exécution plus rapide
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <NavigationBackButton to="/" label="Retour à l'accueil" />
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-center">
          Créez votre livre souvenir
        </h1>
        <div className="w-[100px]"></div>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">
            Importez vos conversations
          </h2>
          <p className="text-muted-foreground mb-6">
            Vous pouvez importer vos conversations WhatsApp, Instagram, ou Facebook pour créer votre livre souvenirs.
          </p>

          {!isUploaded ? (
            <FileUploader 
              selectedPlatform="whatsapp"
              onProcessingComplete={handleMessagesProcessed}
            />
          ) : creationStatus === "processing" ? (
            <BookCreationStatus 
              stage={creationStatus} 
              messageCount={messageCount}
              progress={progress}
            />
          ) : (
            <BookDownloadManager />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUploaderPage;
