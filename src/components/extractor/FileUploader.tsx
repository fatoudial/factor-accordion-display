import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { processFile } from '@/utils/fileProcessing';
import type { MessagePlatform, ProcessedMessage, FilterOptions } from '../extractor/types';

interface FileUploaderProps {
  selectedPlatform: MessagePlatform;
  filterOptions: Partial<FilterOptions>;
  dateRange: { from: Date; to: Date };
  onProcessed: (messages: ProcessedMessage[]) => void;
}

export const FileUploader = ({ selectedPlatform, filterOptions, dateRange, onProcessed }: FileUploaderProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      // Create a complete FilterOptions object with default values
      const completeFilterOptions: FilterOptions = {
        includeMedia: filterOptions.includeMedia ?? true,
        includePhotos: filterOptions.includePhotos ?? true,
        includeVideos: filterOptions.includeVideos ?? false,
        includeVoiceNotes: filterOptions.includeVoiceNotes ?? false,
        includeEmojis: filterOptions.includeEmojis ?? true,
        includeAttachments: filterOptions.includeAttachments ?? false,
        dateRange,
        participants: filterOptions.participants
      };

      const messages = await processFile(file, selectedPlatform, completeFilterOptions);
      onProcessed(messages);
      
      toast({
        title: "Fichier traité avec succès",
        description: `${messages.length} messages ont été extraits.`,
      });
      
      // Store messages in sessionStorage for navigation
      sessionStorage.setItem('extractedMessages', JSON.stringify(messages));
      
    } catch (error) {
      console.error('Erreur lors du traitement du fichier:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter le fichier. Vérifiez le format.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getAcceptedTypes = () => {
    switch (selectedPlatform) {
      case 'whatsapp':
        return '.txt,.zip';
      case 'messenger':
      case 'instagram':
        return '.json,.zip';
      default:
        return '.txt,.json,.zip';
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptedTypes()}
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {uploadedFile ? (
          <div className="space-y-4">
            <FileText className="mx-auto h-12 w-12 text-green-500" />
            <div>
              <p className="text-lg font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {isProcessing && (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Traitement en cours...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium">Télécharger votre fichier</p>
              <p className="text-sm text-gray-500">
                Formats acceptés: {getAcceptedTypes()}
              </p>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="mt-4"
            >
              Sélectionner un fichier
            </Button>
          </div>
        )}
      </div>

      {selectedPlatform === 'whatsapp' && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Important pour WhatsApp:</p>
              <p>Assurez-vous d'exporter votre conversation avec l'option "Avec médias" pour inclure les images et vidéos.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
