
import type { MessagePlatform, ProcessedMessage, FilterOptions } from '@/components/extractor/types';

// Re-export des types pour la compatibilité
export type { MessagePlatform, ProcessedMessage, FilterOptions } from '@/components/extractor/types';

export const processFile = async (file: File, platform: MessagePlatform, options: FilterOptions): Promise<ProcessedMessage[]> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      let messages: ProcessedMessage[] = [];

      switch (platform) {
        case 'whatsapp':
          messages = parseWhatsAppFormat(content, platform);
          break;
        case 'messenger':
          messages = parseMessengerFormat(content, platform);
          break;
        case 'instagram':
          messages = parseInstagramFormat(content, platform);
          break;
      }

      // Appliquer les filtres
      messages = filterMessages(messages, options);
      
      resolve(messages);
    };

    if (file.name.endsWith('.zip')) {
      // Pour les fichiers ZIP (WhatsApp)
      reader.readAsArrayBuffer(file);
    } else {
      // Pour JSON/TXT
      reader.readAsText(file);
    }
  });
};

const parseWhatsAppFormat = (content: string, platform: MessagePlatform): ProcessedMessage[] => {
  // Format WhatsApp: "[JJ/MM/YYYY HH:mm] Nom: Message"
  const messages: ProcessedMessage[] = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const match = line.match(/\[(.*?)\] (.*?): (.*)/);
    if (match) {
      messages.push({
        id: `${platform}-${index}`,
        timestamp: new Date(match[1].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')),
        sender: match[2],
        content: match[3],
        platform,
        type: 'text'
      });
    }
  });

  return messages;
};

const parseMessengerFormat = (content: string, platform: MessagePlatform): ProcessedMessage[] => {
  try {
    const data = JSON.parse(content);
    return data.messages.map((msg: any, index: number) => ({
      id: `${platform}-${index}`,
      sender: msg.sender_name,
      content: msg.content || '',
      timestamp: new Date(msg.timestamp_ms),
      platform,
      type: msg.photos || msg.videos ? 'media' : 'text',
      mediaType: msg.photos ? 'photo' : msg.videos ? 'video' : undefined,
      mediaUrl: msg.photos?.[0]?.uri || msg.videos?.[0]?.uri
    }));
  } catch (e) {
    console.error('Erreur de parsing Messenger:', e);
    return [];
  }
};

const parseInstagramFormat = (content: string, platform: MessagePlatform): ProcessedMessage[] => {
  try {
    const data = JSON.parse(content);
    return data.messages.map((msg: any, index: number) => ({
      id: `${platform}-${index}`,
      sender: msg.sender,
      content: msg.text || '',
      timestamp: new Date(msg.timestamp),
      platform,
      type: msg.media_type ? 'media' : 'text',
      mediaType: msg.media_type,
      mediaUrl: msg.media_url
    }));
  } catch (e) {
    console.error('Erreur de parsing Instagram:', e);
    return [];
  }
};

const filterMessages = (messages: ProcessedMessage[], options: FilterOptions): ProcessedMessage[] => {
  return messages.filter(msg => {
    // Filtre par date
    if (options.dateRange) {
      const msgDate = new Date(msg.timestamp);
      if (msgDate < options.dateRange.from || msgDate > options.dateRange.to) {
        return false;
      }
    }

    // Filtre par type de média
    if (msg.mediaType) {
      if (msg.mediaType === 'photo' && !options.includePhotos) return false;
      if (msg.mediaType === 'video' && !options.includeVideos) return false;
      if (msg.mediaType === 'voice' && !options.includeVoiceNotes) return false;
      if (msg.mediaType === 'attachment' && !options.includeAttachments) return false;
    }

    // Filtre des emojis
    if (!options.includeEmojis && msg.content.match(/[\p{Emoji}]/u)) {
      msg.content = msg.content.replace(/[\p{Emoji}]/gu, '');
    }

    return true;
  });
};
