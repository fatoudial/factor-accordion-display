
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MessagePlatform, ProcessedMessage } from '@/components/extractor/types';
import type { DateRange } from "react-day-picker";
import { addDays } from 'date-fns';
import { FileUploader } from './extractor/FileUploader';
import { FilterOptions } from './extractor/FilterOptions';
import { ActionButtons } from './extractor/ActionButtons';
import { InstagramLoginButton } from './InstagramLoginButton';

const ExtractorTool = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<MessagePlatform>("whatsapp");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  const [filterOptions, setFilterOptions] = useState({
    includeMedia: true,
    includePhotos: true,
    includeVideos: false,
    includeVoiceNotes: false,
    includeEmojis: true,
    includeAttachments: false
  });
  const [processedMessages, setProcessedMessages] = useState<ProcessedMessage[]>([]);

  const toggleFilterOption = (option: keyof typeof filterOptions) => {
    setFilterOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="centered-section-title mx-auto">Extraire vos conversations</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Transformez vos conversations digitales en souvenirs tangibles en quelques clics
        </p>
        
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
          <Tabs defaultValue="whatsapp" className="mb-8" onValueChange={(value: string) => setSelectedPlatform(value as MessagePlatform)}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="messenger">Messenger</TabsTrigger>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
            </TabsList>
            
            <TabsContent value="whatsapp" className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h4 className="font-medium text-green-800 mb-2">Comment exporter depuis WhatsApp</h4>
                <ol className="list-decimal ml-5 text-sm text-gray-700 space-y-2">
                  <li>Ouvrez la conversation que vous souhaitez exporter</li>
                  <li>Appuyez sur les trois points (⋮) en haut à droite</li>
                  <li>Sélectionnez "Plus" puis "Exporter la discussion"</li>
                  <li>Choisissez "Avec médias" ou "Sans médias"</li>
                  <li>Téléchargez le fichier .zip généré</li>
                  <li>Importez ce fichier ci-dessous</li>
                </ol>
              </div>
            </TabsContent>
            
            <TabsContent value="messenger" className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Comment exporter depuis Messenger</h4>
                <ol className="list-decimal ml-5 text-sm text-gray-700 space-y-2">
                  <li>Accédez aux paramètres de votre compte Facebook</li>
                  <li>Cliquez sur "Vos informations Facebook"</li>
                  <li>Sélectionnez "Télécharger vos informations"</li>
                  <li>Cochez uniquement "Messages" et choisissez le format JSON</li>
                  <li>Téléchargez l'archive et extrayez-la</li>
                  <li>Importez le fichier messages.json ci-dessous</li>
                </ol>
              </div>
            </TabsContent>
            
            <TabsContent value="instagram" className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h4 className="font-medium text-purple-800 mb-4">Connexion à Instagram</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Connectez-vous avec votre compte Instagram pour importer automatiquement vos conversations.
                </p>
                <InstagramLoginButton />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-8">
            <FileUploader
              selectedPlatform={selectedPlatform}
              filterOptions={filterOptions}
              dateRange={dateRange as { from: Date; to: Date }}
              onProcessed={setProcessedMessages}
            />

            <FilterOptions
              dateRange={dateRange}
              filterOptions={filterOptions}
              onDateRangeChange={setDateRange}
              onFilterOptionChange={toggleFilterOption}
            />

            <ActionButtons processedMessages={processedMessages} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtractorTool;
