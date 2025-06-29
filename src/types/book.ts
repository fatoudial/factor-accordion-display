
import type { ProcessedMessage } from "@/components/extractor/types";

export type BookFormat = 'EBOOK' | 'PRINT_STANDARD' | 'PRINT_PREMIUM' | 'STANDARD';

export type BubbleColorTheme = 'classic' | 'custom';

export type BubbleColors = {
  sender: string;
  receiver: string;
  background: string;
  text: string;
  primary?: string;
  secondary?: string;
  accent?: string;
};

export interface PageStyles {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  textAlign: string;
  backgroundColor: string;
  textColor: string;
}

export interface BookDesign {
  title: string;
  coverTitle: string;
  coverSubtitle: string;
  coverImage: string;
  coverColor: string;
  coverBackground?: string;
  fontStyle: string;
  textColor: string;
  accentColor: string;
  useAIImages: boolean;
  pageLayout: string;
  messages: ProcessedMessage[];
  format: BookFormat;
  theme?: string;
  dedicationText?: string;
  quoteText?: string;
  bubbleColorTheme?: BubbleColorTheme;
  bubbleColors?: BubbleColors;
  enableQrCodes?: boolean;
  networkSource?: 'whatsapp' | 'instagram' | 'facebook';
  recipientName?: string;
  senderName?: string;
  subtitle?: string;
  pageStyles?: PageStyles;
  fontFamily?: string;
  colorScheme?: string;
  includeImages?: boolean;
  includeEmojis?: boolean;
  includeTimestamps?: boolean;
}

export const DEFAULT_BUBBLE_COLORS: Record<string, BubbleColors> = {
  whatsapp: {
    sender: '#E2FFC7',
    receiver: '#FFFFFF',
    background: '#E9EDEF',
    text: '#111B21'
  },
  instagram: {
    sender: '#8A33FD',
    receiver: '#F1F1F1',
    background: '#FFFFFF',
    text: '#000000' 
  },
  facebook: {
    sender: '#0084FF',
    receiver: '#F1F0F0',
    background: '#FFFFFF',
    text: '#000000'
  },
  custom: {
    sender: '#E2F7FF',
    receiver: '#F1F1F1',
    background: '#FFFFFF',
    text: '#333333'
  }
};
