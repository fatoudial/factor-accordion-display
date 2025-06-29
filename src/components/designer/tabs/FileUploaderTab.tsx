
import React from 'react';
import FileUploader from '@/components/designer/FileUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagePlatform, ProcessedMessage } from '@/components/extractor/types';
import { ArrowRight } from 'lucide-react';

interface FileUploaderTabProps {
  onMessagesProcessed: (messages: ProcessedMessage[]) => void;
}

export const FileUploaderTab: React.FC<FileUploaderTabProps> = ({ onMessagesProcessed }) => {
  const [platform, setPlatform] = React.useState<MessagePlatform>('whatsapp');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-serif font-semibold text-ts-indigo mb-6">
        Téléchargez vos conversations
      </h2>
      
      <p className="mb-6 text-gray-600">
        Téléchargez le fichier d'export de vos conversations pour créer votre livre souvenir.
      </p>

      <Tabs defaultValue="whatsapp" onValueChange={(value) => setPlatform(value as MessagePlatform)}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="messenger">Messenger</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle>Export WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader 
                onProcessingComplete={onMessagesProcessed} 
                selectedPlatform="whatsapp"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messenger">
          <Card>
            <CardHeader>
              <CardTitle>Export Facebook Messenger</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader 
                onProcessingComplete={onMessagesProcessed} 
                selectedPlatform="messenger"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instagram">
          <Card>
            <CardHeader>
              <CardTitle>Export Instagram Direct</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader 
                onProcessingComplete={onMessagesProcessed} 
                selectedPlatform="instagram"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
