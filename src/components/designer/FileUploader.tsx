
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, AlertCircle, CheckCircle } from 'lucide-react';
import { MessagePlatform, ProcessedMessage } from '@/components/extractor/types';
import { Badge } from '@/components/ui/badge';

interface FileUploaderProps {
  selectedPlatform: MessagePlatform;
  onProcessingComplete: (messages: ProcessedMessage[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  selectedPlatform, 
  onProcessingComplete 
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setProcessingStatus('uploading');
      processFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/json': ['.json'],
      'application/zip': ['.zip'],
    },
    maxFiles: 1,
  });

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingStatus('processing');
    setErrorMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const simulatedMessages: ProcessedMessage[] = [
        {
          id: '1',
          sender: 'Alice',
          content: 'Salut ! Comment ça va ?',
          timestamp: new Date('2024-01-01T10:00:00'),
          platform: selectedPlatform,
          type: 'text'
        },
        {
          id: '2',
          sender: 'Bob',
          content: 'Ça va bien, merci ! Et toi ?',
          timestamp: new Date('2024-01-01T10:05:00'),
          platform: selectedPlatform,
          type: 'text'
        },
        {
          id: '3',
          sender: 'Alice',
          content: 'Parfait ! On se voit ce soir ?',
          timestamp: new Date('2024-01-01T10:10:00'),
          platform: selectedPlatform,
          type: 'text'
        }
      ];

      setProcessingStatus('completed');
      onProcessingComplete(simulatedMessages);
    } catch (error) {
      setProcessingStatus('error');
      setErrorMessage('Erreur lors du traitement du fichier. Veuillez réessayer.');
      console.error('Erreur de traitement:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPlatformName = (platform: MessagePlatform) => {
    switch (platform) {
      case 'whatsapp': return 'WhatsApp';
      case 'messenger': return 'Facebook Messenger';
      case 'instagram': return 'Instagram';
      default: return platform;
    }
  };

  const getAcceptedFormats = (platform: MessagePlatform) => {
    switch (platform) {
      case 'whatsapp': return '.txt';
      case 'messenger': return '.json, .zip';
      case 'instagram': return '.json, .zip';
      default: return '.txt, .json, .zip';
    }
  };

  const handleSelectFile = () => {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="text-lg px-4 py-2">
          {getPlatformName(selectedPlatform)}
        </Badge>
        <span className="text-sm text-gray-600">
          Formats acceptés: {getAcceptedFormats(selectedPlatform)}
        </span>
      </div>

      <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer transition-colors ${
              isDragActive ? 'bg-blue-50' : ''
            }`}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              
              <div>
                <p className="text-lg font-medium">
                  {isDragActive
                    ? 'Déposez le fichier ici...'
                    : 'Glissez-déposez votre fichier ici ou cliquez pour sélectionner'
                  }
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Fichier d'export {getPlatformName(selectedPlatform)} ({getAcceptedFormats(selectedPlatform)})
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {uploadedFile && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {processingStatus === 'processing' && (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    <span className="text-sm text-blue-600">Traitement en cours...</span>
                  </>
                )}
                
                {processingStatus === 'completed' && (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-600">Traitement terminé</span>
                  </>
                )}
                
                {processingStatus === 'error' && (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-600">Erreur</span>
                  </>
                )}
              </div>
            </div>
            
            {errorMessage && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {errorMessage}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!uploadedFile && (
        <div className="text-center">
          <Button onClick={handleSelectFile}>
            Sélectionner un fichier
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
