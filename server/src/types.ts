
export type MessagePlatform = 'whatsapp' | 'messenger' | 'instagram';

export interface ProcessedMessage {
  sender: string;
  content: string;
  timestamp: Date | string | number;
  mediaType?: 'photo' | 'video' | 'voice' | 'attachment';
  mediaUrl?: string;
}

export interface BookDesign {
  coverTitle: string;
  coverSubtitle: string;
  coverImage: string;
  coverColor: string;
  fontStyle: string;
  textColor: string;
  accentColor: string;
  useAIImages: boolean;
  pageLayout: string;
  messages: ProcessedMessage[];
  font?: string;
}
