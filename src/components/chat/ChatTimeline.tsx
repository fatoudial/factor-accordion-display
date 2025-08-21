import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ChatBubble from './ChatBubble';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwner: boolean;
  attachments?: string[];
}

interface ChatTimelineProps {
  messages: ChatMessage[];
  title?: string;
}

const ChatTimeline: React.FC<ChatTimelineProps> = ({ messages, title = "Conversation" }) => {
  // Grouper les messages par date
  const groupedMessages = messages.reduce((groups: { [key: string]: ChatMessage[] }, message) => {
    const dateKey = format(message.timestamp, 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {messages.length} message{messages.length > 1 ? 's' : ''}
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4 pb-4">
          {Object.entries(groupedMessages).map(([dateKey, dayMessages]) => (
            <div key={dateKey} className="mb-6">
              {/* Séparateur de date */}
              <div className="flex items-center my-4">
                <Separator className="flex-1" />
                <span className="px-3 text-xs text-gray-500 bg-white font-medium">
                  {format(new Date(dateKey), 'EEEE d MMMM yyyy', { locale: fr })}
                </span>
                <Separator className="flex-1" />
              </div>
              
              {/* Messages du jour */}
              <div className="space-y-2">
                {dayMessages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))}
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun message à afficher</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChatTimeline;