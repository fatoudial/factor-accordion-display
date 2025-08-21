import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  Image, 
  Users, 
  Calendar, 
  BookOpen, 
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import ChatTimeline from '@/components/chat/ChatTimeline';
import { zipProcessorService, type ProcessedChatData, type ExtractedMessage } from '@/services/zipProcessor';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ChatBookCreator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chatData, setChatData] = useState<ProcessedChatData | null>(null);
  const [bookTitle, setBookTitle] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [isCreatingBook, setIsCreatingBook] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/zip' || selectedFile.name.endsWith('.zip')) {
        setFile(selectedFile);
        setChatData(null);
        setSelectedMessages(new Set());
      } else {
        toast({
          title: "Format non supporté",
          description: "Veuillez sélectionner un fichier ZIP",
          variant: "destructive"
        });
      }
    }
  };

  const processZipFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Simulation du progrès
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const processedData = await zipProcessorService.processZipFile(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setChatData(processedData);
      
      // Sélectionner tous les messages par défaut
      const allMessageIds = new Set(processedData.messages.map(m => m.id));
      setSelectedMessages(allMessageIds);
      
      // Générer un titre automatique
      if (processedData.metadata.participants.length > 0) {
        const participants = processedData.metadata.participants.slice(0, 2).join(' et ');
        setBookTitle(`Conversation ${participants}`);
      } else {
        setBookTitle('Mon livre de conversation');
      }
      
      // Générer une description automatique
      if (processedData.metadata.dateRange) {
        const startDate = format(processedData.metadata.dateRange.start, 'd MMMM yyyy', { locale: fr });
        const endDate = format(processedData.metadata.dateRange.end, 'd MMMM yyyy', { locale: fr });
        setBookDescription(`Conversation du ${startDate} au ${endDate} avec ${processedData.metadata.totalMessages} messages et ${processedData.metadata.totalImages} images.`);
      }
      
      toast({
        title: "Extraction réussie !",
        description: `${processedData.metadata.totalMessages} messages et ${processedData.metadata.totalImages} images extraits`,
      });
      
    } catch (error) {
      console.error('Erreur lors du traitement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter le fichier ZIP",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMessageSelection = (messageId: string) => {
    const newSelection = new Set(selectedMessages);
    if (newSelection.has(messageId)) {
      newSelection.delete(messageId);
    } else {
      newSelection.add(messageId);
    }
    setSelectedMessages(newSelection);
  };

  const createBook = async () => {
    if (!chatData || !bookTitle) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir le titre du livre",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingBook(true);
    
    try {
      // Filtrer les messages sélectionnés
      const selectedMessagesData = chatData.messages.filter(m => selectedMessages.has(m.id));
      
      // Ici vous pouvez intégrer avec votre service de création de livres
      // Pour l'instant, on simule la création
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Livre créé avec succès !",
        description: `"${bookTitle}" a été créé avec ${selectedMessagesData.length} messages`,
      });
      
      // Rediriger vers la page de prévisualisation ou de commande
      navigate('/designer', { 
        state: { 
          bookData: {
            title: bookTitle,
            description: bookDescription,
            messages: selectedMessagesData,
            images: chatData.images
          }
        }
      });
      
    } catch (error) {
      console.error('Erreur lors de la création du livre:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le livre",
        variant: "destructive"
      });
    } finally {
      setIsCreatingBook(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Créer un livre depuis vos conversations
        </h1>
        <p className="text-gray-600">
          Importez un fichier ZIP contenant vos conversations et images pour créer un livre personnalisé
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section d'import */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Importer le ZIP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Fichier ZIP de conversation</Label>
                <Input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept=".zip"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formats supportés: WhatsApp, Facebook, exports personnalisés
                </p>
              </div>
              
              {file && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-blue-700">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              )}
              
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Traitement en cours...</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
              
              <Button 
                onClick={processZipFile}
                disabled={!file || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Analyser le fichier
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Métadonnées */}
          {chatData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Résumé de l'extraction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Messages:</span>
                  <Badge variant="secondary">
                    {chatData.metadata.totalMessages}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Images:</span>
                  <Badge variant="secondary">
                    {chatData.metadata.totalImages}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Participants:</span>
                  <Badge variant="secondary">
                    {chatData.metadata.participants.length}
                  </Badge>
                </div>
                {chatData.metadata.dateRange && (
                  <div className="text-xs text-gray-500">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {format(chatData.metadata.dateRange.start, 'd MMM', { locale: fr })} - {format(chatData.metadata.dateRange.end, 'd MMM yyyy', { locale: fr })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Configuration du livre */}
          {chatData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Configuration du livre
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="book-title">Titre du livre</Label>
                  <Input
                    id="book-title"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="Mon livre de conversation"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="book-description">Description</Label>
                  <Textarea
                    id="book-description"
                    value={bookDescription}
                    onChange={(e) => setBookDescription(e.target.value)}
                    placeholder="Description de votre livre..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div className="text-sm text-gray-600">
                  <strong>{selectedMessages.size}</strong> message{selectedMessages.size > 1 ? 's' : ''} sélectionné{selectedMessages.size > 1 ? 's' : ''}
                </div>
                
                <Button 
                  onClick={createBook}
                  disabled={!bookTitle || selectedMessages.size === 0 || isCreatingBook}
                  className="w-full"
                >
                  {isCreatingBook ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Créer le livre
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Prévisualisation de la conversation */}
        <div className="lg:col-span-2">
          {chatData ? (
            <div className="h-[800px]">
              <ChatTimeline 
                messages={chatData.messages} 
                title={`Prévisualisation - ${chatData.metadata.participants.join(', ')}`}
              />
            </div>
          ) : (
            <Card className="h-[800px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Aucun fichier importé
                  </h3>
                  <p className="text-gray-600">
                    Sélectionnez un fichier ZIP pour commencer
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBookCreator;