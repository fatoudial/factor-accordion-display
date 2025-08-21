import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwner: boolean;
  attachments?: string[];
}

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  return (
    <div className={`flex mb-4 ${message.isOwner ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start gap-3 max-w-[70%] ${message.isOwner ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className={`text-xs ${message.isOwner ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
            {message.sender.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <Card className={`p-3 ${message.isOwner ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
          <div className="mb-1">
            <p className={`text-xs font-medium ${message.isOwner ? 'text-blue-100' : 'text-gray-600'}`}>
              {message.sender}
            </p>
          </div>
          
          <div className="space-y-2">
            {message.content && (
              <p className="text-sm leading-relaxed break-words">
                {message.content}
              </p>
            )}
            
            {message.attachments && message.attachments.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={attachment} 
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(attachment, '_blank')}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-2">
            <p className={`text-xs ${message.isOwner ? 'text-blue-100' : 'text-gray-500'}`}>
              {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: fr })}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatBubble;