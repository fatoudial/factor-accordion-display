
export type MessagePlatform = 'whatsapp' | 'messenger' | 'instagram';

export interface ProcessedMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  platform: MessagePlatform;
  type: 'text' | 'media';
  mediaType?: 'photo' | 'video' | 'voice' | 'attachment';
  mediaUrl?: string;
}

export interface FilterOptions {
  includeMedia: boolean;
  includePhotos?: boolean;
  includeVideos?: boolean;
  includeVoiceNotes?: boolean;
  includeEmojis?: boolean;
  includeAttachments?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
  participants?: string[];
}

// Legacy compatibility
export type Message = ProcessedMessage;
