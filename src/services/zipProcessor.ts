import JSZip from 'jszip';

export interface ExtractedMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwner: boolean;
  attachments?: string[];
}

export interface ProcessedChatData {
  messages: ExtractedMessage[];
  images: { [key: string]: string }; // filename -> base64 data URL
  metadata: {
    totalMessages: number;
    totalImages: number;
    dateRange: { start: Date; end: Date } | null;
    participants: string[];
  };
}

class ZipProcessorService {
  async processZipFile(file: File): Promise<ProcessedChatData> {
    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      
      const messages: ExtractedMessage[] = [];
      const images: { [key: string]: string } = {};
      const participants = new Set<string>();
      
      // Traiter les fichiers
      for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
        if (zipEntry.dir) continue;
        
        // Traiter les images
        if (this.isImageFile(filename)) {
          try {
            const imageData = await zipEntry.async('base64');
            const mimeType = this.getMimeType(filename);
            images[filename] = `data:${mimeType};base64,${imageData}`;
          } catch (error) {
            console.warn(`Erreur lors du traitement de l'image ${filename}:`, error);
          }
        }
        
        // Traiter les fichiers de conversation
        if (this.isTextFile(filename)) {
          try {
            const content = await zipEntry.async('text');
            const extractedMessages = this.parseTextFile(content, filename);
            messages.push(...extractedMessages);
            
            extractedMessages.forEach(msg => participants.add(msg.sender));
          } catch (error) {
            console.warn(`Erreur lors du traitement du fichier ${filename}:`, error);
          }
        }
      }
      
      // Trier les messages par timestamp
      messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      // Associer les images aux messages
      this.linkImagesToMessages(messages, images);
      
      // Calculer les métadonnées
      const metadata = this.calculateMetadata(messages, images, Array.from(participants));
      
      return {
        messages,
        images,
        metadata
      };
    } catch (error) {
      console.error('Erreur lors du traitement du ZIP:', error);
      throw new Error('Impossible de traiter le fichier ZIP');
    }
  }
  
  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }
  
  private isTextFile(filename: string): boolean {
    const textExtensions = ['.txt', '.json', '.csv', '.html'];
    return textExtensions.some(ext => filename.toLowerCase().endsWith(ext)) ||
           filename.toLowerCase().includes('chat') ||
           filename.toLowerCase().includes('message') ||
           filename.toLowerCase().includes('conversation');
  }
  
  private getMimeType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    const mimeTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'bmp': 'image/bmp'
    };
    return mimeTypes[ext || ''] || 'image/jpeg';
  }
  
  private parseTextFile(content: string, filename: string): ExtractedMessage[] {
    const messages: ExtractedMessage[] = [];
    
    try {
      // Tentative de parsing JSON (format WhatsApp Business API)
      if (filename.endsWith('.json')) {
        return this.parseJsonMessages(content);
      }
      
      // Tentative de parsing WhatsApp export standard
      if (content.includes('Messages sans chiffrement de bout en bout') || 
          content.includes('Messages without end-to-end encryption')) {
        return this.parseWhatsAppExport(content);
      }
      
      // Tentative de parsing format générique
      return this.parseGenericTextFormat(content);
      
    } catch (error) {
      console.warn(`Erreur lors du parsing de ${filename}:`, error);
      return [];
    }
  }
  
  private parseJsonMessages(content: string): ExtractedMessage[] {
    try {
      const data = JSON.parse(content);
      const messages: ExtractedMessage[] = [];
      
      // Format potentiel: array de messages
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          if (item.text || item.message || item.content) {
            messages.push({
              id: `json_${index}`,
              sender: item.sender || item.from || item.author || 'Inconnu',
              content: item.text || item.message || item.content || '',
              timestamp: this.parseTimestamp(item.timestamp || item.date || item.time) || new Date(),
              isOwner: this.determineOwnership(item.sender || item.from || item.author),
              attachments: item.attachments || item.media || []
            });
          }
        });
      }
      
      return messages;
    } catch {
      return [];
    }
  }
  
  private parseWhatsAppExport(content: string): ExtractedMessage[] {
    const messages: ExtractedMessage[] = [];
    const lines = content.split('\n');
    
    // Pattern pour WhatsApp: [DD/MM/YYYY, HH:MM:SS] Sender: Message
    const whatsappPattern = /^\[?(\d{1,2}\/\d{1,2}\/\d{4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*[-:]?\s*([^:]+?):\s*(.+)$/;
    
    let messageId = 0;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      const match = trimmedLine.match(whatsappPattern);
      if (match) {
        const [, dateStr, timeStr, sender, content] = match;
        
        try {
          const timestamp = this.parseWhatsAppDateTime(dateStr, timeStr);
          
          messages.push({
            id: `wa_${messageId++}`,
            sender: sender.trim(),
            content: content.trim(),
            timestamp,
            isOwner: this.determineOwnership(sender.trim())
          });
        } catch (error) {
          console.warn('Erreur lors du parsing de la date:', error);
        }
      }
    }
    
    return messages;
  }
  
  private parseGenericTextFormat(content: string): ExtractedMessage[] {
    const messages: ExtractedMessage[] = [];
    const lines = content.split('\n');
    
    let messageId = 0;
    let currentMessage = '';
    let currentSender = 'Inconnu';
    let currentTimestamp = new Date();
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Détecter les nouveaux messages (format flexible)
      const messagePattern = /^(.+?):\s*(.+)$|^(.+)\s+dit\s*:\s*(.+)$|^(.+)\s*-\s*(.+)$/;
      const match = trimmedLine.match(messagePattern);
      
      if (match) {
        // Sauvegarder le message précédent s'il existe
        if (currentMessage) {
          messages.push({
            id: `generic_${messageId++}`,
            sender: currentSender,
            content: currentMessage,
            timestamp: currentTimestamp,
            isOwner: this.determineOwnership(currentSender)
          });
        }
        
        // Démarrer un nouveau message
        currentSender = (match[1] || match[3] || match[5] || 'Inconnu').trim();
        currentMessage = (match[2] || match[4] || match[6] || '').trim();
        currentTimestamp = new Date(); // Date actuelle par défaut
      } else {
        // Continuer le message actuel
        currentMessage += ' ' + trimmedLine;
      }
    }
    
    // Ajouter le dernier message
    if (currentMessage) {
      messages.push({
        id: `generic_${messageId++}`,
        sender: currentSender,
        content: currentMessage,
        timestamp: currentTimestamp,
        isOwner: this.determineOwnership(currentSender)
      });
    }
    
    return messages;
  }
  
  private parseWhatsAppDateTime(dateStr: string, timeStr: string): Date {
    // Format: DD/MM/YYYY et HH:MM:SS ou HH:MM
    const [day, month, year] = dateStr.split('/').map(Number);
    const timeParts = timeStr.split(':').map(Number);
    const hour = timeParts[0];
    const minute = timeParts[1];
    const second = timeParts[2] || 0;
    
    return new Date(year, month - 1, day, hour, minute, second);
  }
  
  private parseTimestamp(timestamp: any): Date | null {
    if (!timestamp) return null;
    
    // Si c'est déjà une date
    if (timestamp instanceof Date) return timestamp;
    
    // Si c'est un timestamp Unix
    if (typeof timestamp === 'number') {
      return new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp);
    }
    
    // Si c'est une string
    if (typeof timestamp === 'string') {
      const parsed = new Date(timestamp);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    
    return null;
  }
  
  private determineOwnership(sender: string): boolean {
    // Logique pour déterminer si c'est le propriétaire du chat
    // Peut être personnalisé selon les besoins
    const ownerKeywords = ['moi', 'me', 'vous', 'you', 'owner'];
    return ownerKeywords.some(keyword => 
      sender.toLowerCase().includes(keyword)
    );
  }
  
  private linkImagesToMessages(messages: ExtractedMessage[], images: { [key: string]: string }): void {
    // Associer les images aux messages basé sur les timestamps ou noms de fichiers
    const imageFilenames = Object.keys(images);
    
    messages.forEach(message => {
      // Rechercher des images qui pourraient correspondre à ce message
      const relatedImages = imageFilenames.filter(filename => {
        // Logique simple: images avec timestamps proches
        // Peut être améliorée selon le format des noms de fichiers
        return true; // Pour l'instant, toutes les images sont disponibles
      });
      
      if (relatedImages.length > 0) {
        message.attachments = relatedImages.map(filename => images[filename]).slice(0, 4); // Max 4 images par message
      }
    });
  }
  
  private calculateMetadata(messages: ExtractedMessage[], images: { [key: string]: string }, participants: string[]) {
    const timestamps = messages.map(m => m.timestamp).filter(Boolean);
    
    return {
      totalMessages: messages.length,
      totalImages: Object.keys(images).length,
      dateRange: timestamps.length > 0 ? {
        start: new Date(Math.min(...timestamps.map(t => t.getTime()))),
        end: new Date(Math.max(...timestamps.map(t => t.getTime())))
      } : null,
      participants
    };
  }
}

export const zipProcessorService = new ZipProcessorService();