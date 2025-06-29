
import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { ProcessedMessage, MessagePlatform } from '../types';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const router = Router();

// Configuration du stockage des fichiers téléchargés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/extract', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const platform = req.body.platform as MessagePlatform;
    
    if (!file || !platform) {
      return res.status(400).json({ error: 'File and platform are required' });
    }

    // Extraction des messages selon le type de plateforme
    let messages: ProcessedMessage[] = [];
    
    if (platform === 'whatsapp') {
      messages = await extractWhatsAppMessages(file.path);
    } else if (platform === 'messenger') {
      messages = await extractMessengerMessages(file.path);
    } else if (platform === 'instagram') {
      messages = await extractInstagramMessages(file.path);
    }
    
    res.json({ messages });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  } finally {
    // Nettoyer le fichier téléchargé
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
  }
});

// Fonction pour extraire les messages WhatsApp
async function extractWhatsAppMessages(filePath: string): Promise<ProcessedMessage[]> {
  const messages: ProcessedMessage[] = [];
  
  // Pour une demo simple, on lit ligne par ligne pour les fichiers txt
  if (filePath.endsWith('.txt')) {
    const fileStream = createReadStream(filePath);
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    
    for await (const line of rl) {
      // Format WhatsApp: "[JJ/MM/YYYY HH:mm] Nom: Message"
      const match = line.match(/\[(.*?)\] (.*?): (.*)/);
      if (match) {
        const timestamp = new Date(match[1].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
        messages.push({
          sender: match[2],
          content: match[3],
          timestamp: timestamp,
        });
      }
    }
  }
  
  // Pour les fichiers .zip, il faudrait les décompresser etc. (pour une implémentation plus complète)
  
  return messages;
}

async function extractMessengerMessages(filePath: string): Promise<ProcessedMessage[]> {
  // Pour une démo, supposons que le fichier est un JSON
  if (filePath.endsWith('.json')) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    try {
      const data = JSON.parse(fileContent);
      return data.messages.map((msg: any) => ({
        sender: msg.sender_name,
        content: msg.content || '',
        timestamp: new Date(msg.timestamp_ms),
        mediaType: msg.photos ? 'photo' : msg.videos ? 'video' : undefined,
        mediaUrl: msg.photos?.[0]?.uri || msg.videos?.[0]?.uri
      }));
    } catch (e) {
      console.error('Error parsing Messenger JSON:', e);
    }
  }
  
  return [];
}

async function extractInstagramMessages(filePath: string): Promise<ProcessedMessage[]> {
  // Pour une démo, similaire à Messenger
  if (filePath.endsWith('.json')) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    try {
      const data = JSON.parse(fileContent);
      return data.messages.map((msg: any) => ({
        sender: msg.sender || msg.sender_name,
        content: msg.text || msg.content || '',
        timestamp: new Date(msg.timestamp || msg.timestamp_ms),
        mediaType: msg.media_type,
        mediaUrl: msg.media_url
      }));
    } catch (e) {
      console.error('Error parsing Instagram JSON:', e);
    }
  }
  
  return [];
}

export { router };
