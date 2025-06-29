
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface BookCreationStatusProps {
  stage: "processing" | "completed";
  messageCount: number;
  progress?: number;
}

const BookCreationStatus: React.FC<BookCreationStatusProps> = ({
  stage,
  messageCount,
  progress = 0
}) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      processing: "Traitement de vos messages...",
      completed: "Traitement terminé !",
      messagesExtracted: "messages extraits",
      readyToProceed: "Votre livre est prêt à être créé",
      redirecting: "Redirection vers l'éditeur..."
    },
    en: {
      processing: "Processing your messages...",
      completed: "Processing complete!",
      messagesExtracted: "messages extracted",
      readyToProceed: "Your book is ready to be created",
      redirecting: "Redirecting to editor..."
    }
  };

  const t = translations[language] || translations.fr;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
      {stage === "processing" ? (
        <>
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t.processing}</h3>
          <Progress value={progress} className="w-full mb-2" />
          <p className="text-gray-500">{progress}%</p>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t.completed}</h3>
          <p className="text-lg mb-2">
            <span className="font-bold text-primary">{messageCount}</span> {t.messagesExtracted}
          </p>
          <p className="text-muted-foreground">{t.readyToProceed}</p>
          <p className="text-sm text-gray-500 mt-4 animate-pulse">{t.redirecting}</p>
        </>
      )}
    </div>
  );
};

export default BookCreationStatus;
