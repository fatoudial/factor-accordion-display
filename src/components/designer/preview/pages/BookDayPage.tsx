
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Image, FileAudio, FileVideo } from 'lucide-react';
import type { BookDesign } from '@/types/book';
import type { ProcessedMessage } from '@/utils/fileProcessing';
import { QRCode } from './QRCode';

interface BookDayPageProps {
  dateIndex: number;
  date: string;
  messages: ProcessedMessage[];
  design: BookDesign;
}

export const BookDayPage: React.FC<BookDayPageProps> = ({ 
  dateIndex, 
  date, 
  messages,
  design 
}) => {
  const getFont = () => {
    switch (design.fontStyle) {
      case 'classic': return 'font-serif';
      case 'elegant': return 'font-serif italic';
      case 'playful': return 'font-sans';
      default: return 'font-sans';
    }
  };
  
  const getLayoutClass = () => {
    switch (design.pageLayout) {
      case 'creative': return 'creative-layout';
      case 'minimalist': return 'minimalist-layout';
      default: return 'standard-layout';
    }
  };
  
  const getMessageType = (msg: ProcessedMessage) => {
    if (msg.mediaType === 'photo') return 'image';
    if (msg.mediaType === 'video') return 'video';
    if (msg.mediaType === 'voice') return 'audio';
    return 'text';
  };
  
  // Get network-specific bubble styles
  const getNetworkStyles = () => {
    const networkSource = design.networkSource || 'whatsapp';
    const bubbleColors = design.bubbleColors || { 
      sender: '#E2FFC7', 
      receiver: '#FFFFFF',
      background: '#E9EDEF',
      text: '#111B21'
    };
    
    switch (networkSource) {
      case 'whatsapp':
        return {
          background: bubbleColors.background || '#E9EDEF',
          senderBubble: {
            backgroundColor: bubbleColors.sender || '#E2FFC7',
            borderRadius: '0.75rem 0.75rem 0 0.75rem',
            color: bubbleColors.text || '#111B21'
          },
          receiverBubble: {
            backgroundColor: bubbleColors.receiver || '#FFFFFF',
            borderRadius: '0.75rem 0.75rem 0.75rem 0',
            color: bubbleColors.text || '#111B21'
          },
          timeColor: '#92AAB1',
          showSenderName: false
        };
      case 'instagram':
        return {
          background: bubbleColors.background || '#FFFFFF',
          senderBubble: {
            backgroundColor: bubbleColors.sender || '#8A33FD',
            backgroundImage: 'linear-gradient(to bottom right, #8A33FD, #D946EF)',
            borderRadius: '1rem',
            color: 'white'
          },
          receiverBubble: {
            backgroundColor: bubbleColors.receiver || '#F1F1F1',
            borderRadius: '1rem',
            color: bubbleColors.text || '#000000'
          },
          timeColor: '#8e8e8e',
          showSenderName: true
        };
      case 'facebook':
        return {
          background: bubbleColors.background || '#FFFFFF',
          senderBubble: {
            backgroundColor: bubbleColors.sender || '#0084FF',
            borderRadius: '1.5rem',
            color: 'white'
          },
          receiverBubble: {
            backgroundColor: bubbleColors.receiver || '#F1F0F0',
            borderRadius: '1.5rem',
            color: bubbleColors.text || '#000000'
          },
          timeColor: '#65676B',
          showSenderName: true
        };
      default:
        return {
          background: '#FFFFFF',
          senderBubble: {
            backgroundColor: '#E2FFC7',
            borderRadius: '0.75rem',
            color: '#111B21'
          },
          receiverBubble: {
            backgroundColor: '#FFFFFF',
            borderRadius: '0.75rem',
            color: '#111B21'
          },
          timeColor: '#92AAB1',
          showSenderName: false
        };
    }
  };

  const styles = getNetworkStyles();

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 italic">Aperçu de la page {dateIndex + 1}</p>
      </div>
    );
  }

  return (
    <div 
      className={`space-y-4 p-6 ${getLayoutClass()}`}
      style={{ backgroundColor: styles.background }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-xl font-medium" style={{ color: design.accentColor || '#6E59A5' }}>
          {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </h2>
        <div className="w-16 h-1 mx-auto mt-2" style={{ backgroundColor: design.accentColor || '#6E59A5' }}></div>
      </div>
      
      {messages.map((msg, idx) => {
        const isRight = design.pageLayout === 'creative' 
          ? idx % 3 === 0
          : msg.sender === messages[0].sender;
          
        const alignmentClass = isRight 
          ? 'ml-auto' 
          : design.pageLayout === 'minimalist' 
            ? 'mx-auto'
            : 'mr-auto';
          
        const cardWidth = design.pageLayout === 'minimalist' 
          ? 'max-w-[70%]' 
          : 'max-w-[80%]';
        
        const bubbleStyle = isRight ? styles.senderBubble : styles.receiverBubble;
        const messageType = getMessageType(msg);
        
        // S'assurer que timestamp est un objet Date
        const messageTimestamp = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
        
        return (
          <Card 
            key={idx} 
            className={`${alignmentClass} ${cardWidth} border-0 shadow-sm overflow-hidden`}
            style={bubbleStyle}
          >
            <CardContent className="p-3">
              {styles.showSenderName && (
                <p className="text-sm font-medium mb-1" style={{ 
                  color: isRight && design.networkSource !== 'instagram' ? 'white' : '#8e8e8e'
                }}>
                  {msg.sender}
                </p>
              )}
              
              <p className={`mt-1 ${getFont()}`}>
                {msg.content}
              </p>
              
              {messageType === 'image' && msg.mediaUrl && (
                <div className="mt-2 rounded overflow-hidden">
                  <img 
                    src={msg.mediaUrl} 
                    alt="Media" 
                    className="w-full h-auto max-h-40 object-cover"
                  />
                </div>
              )}
              
              {messageType === 'video' && (
                <div className="mt-2 flex items-center">
                  <FileVideo className="h-6 w-6 mr-2" style={{ color: isRight && ['instagram', 'facebook'].includes(design.networkSource || '') ? 'white' : '#6E59A5' }} />
                  <span className="text-sm">Vidéo</span>
                  {design.enableQrCodes && <QRCode url={msg.mediaUrl || '#'} label="Vidéo" className="ml-auto" />}
                </div>
              )}
              
              {messageType === 'audio' && (
                <div className="mt-2 flex items-center">
                  <FileAudio className="h-6 w-6 mr-2" style={{ color: isRight && ['instagram', 'facebook'].includes(design.networkSource || '') ? 'white' : '#6E59A5' }} />
                  <span className="text-sm">Message Vocal</span>
                  {design.enableQrCodes && <QRCode url={msg.mediaUrl || '#'} label="Audio" className="ml-auto" />}
                </div>
              )}
              
              <p className="mt-2 text-right text-xs" style={{ color: styles.timeColor }}>
                {design.networkSource === 'whatsapp' && isRight && (
                  <span className="inline-block mr-1">✓✓</span>
                )}
                {messageTimestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
              </p>
            </CardContent>
          </Card>
        );
      })}
      
      {design.useAIImages && dateIndex % 2 === 0 && (
        <div className="my-6 p-2 border border-gray-200 rounded">
          <div className="flex items-center justify-center bg-gray-100 p-4 rounded">
            <div className="flex flex-col items-center text-gray-500">
              <Image className="h-10 w-10 mb-2" />
              <p>Illustration générée par IA</p>
              <p className="text-xs text-gray-400 mt-1">
                (Les images seront générées lors de la création finale)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
