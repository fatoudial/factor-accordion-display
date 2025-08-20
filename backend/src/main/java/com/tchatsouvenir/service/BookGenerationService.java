package com.tchatsouvenir.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
public class BookGenerationService {

    @Value("${app.storage.path:./storage/books}")
    private String storagePath;

    @Value("${app.media.path:./storage/media}")
    private String mediaStoragePath;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> generateBookFromZip(MultipartFile zipFile, String userId, Map<String, Object> bookConfig) {
        String bookId = generateBookId();
        
        try {
            // Créer les dossiers de stockage
            createStorageDirectories();
            
            // Extraire le contenu du ZIP
            Map<String, Object> extractedContent = extractZipContent(zipFile, bookId);
            
            // Traiter les messages
            List<Map<String, Object>> messages = processMessages(extractedContent, bookId);
            
            // Générer le PDF
            String pdfPath = generatePDF(messages, bookConfig, bookId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("bookId", bookId);
            result.put("status", "completed");
            result.put("messageCount", messages.size());
            result.put("pdfPath", pdfPath);
            result.put("downloadUrl", frontendUrl + "/api/books/download/" + bookId);
            
            return result;
            
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du livre: " + e.getMessage(), e);
        }
    }

    private Map<String, Object> extractZipContent(MultipartFile zipFile, String bookId) throws IOException {
        Map<String, Object> content = new HashMap<>();
        List<String> textFiles = new ArrayList<>();
        List<String> mediaFiles = new ArrayList<>();
        
        Path bookMediaDir = Paths.get(mediaStoragePath, bookId);
        Files.createDirectories(bookMediaDir);
        
        try (ZipInputStream zis = new ZipInputStream(zipFile.getInputStream())) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                if (entry.isDirectory()) continue;
                
                String fileName = entry.getName();
                Path filePath = bookMediaDir.resolve(fileName);
                Files.createDirectories(filePath.getParent());
                
                if (isTextFile(fileName)) {
                    // Lire le contenu du fichier texte
                    StringBuilder textContent = new StringBuilder();
                    byte[] buffer = new byte[1024];
                    int len;
                    while ((len = zis.read(buffer)) > 0) {
                        textContent.append(new String(buffer, 0, len, "UTF-8"));
                    }
                    textFiles.add(textContent.toString());
                } else if (isMediaFile(fileName)) {
                    // Sauvegarder le fichier média
                    Files.copy(zis, filePath);
                    mediaFiles.add(fileName);
                }
                
                zis.closeEntry();
            }
        }
        
        content.put("textFiles", textFiles);
        content.put("mediaFiles", mediaFiles);
        content.put("bookId", bookId);
        
        return content;
    }

    private List<Map<String, Object>> processMessages(Map<String, Object> extractedContent, String bookId) {
        List<Map<String, Object>> messages = new ArrayList<>();
        List<String> textFiles = (List<String>) extractedContent.get("textFiles");
        List<String> mediaFiles = (List<String>) extractedContent.get("mediaFiles");
        
        for (String textContent : textFiles) {
            messages.addAll(parseWhatsAppMessages(textContent, mediaFiles, bookId));
        }
        
        // Trier les messages par date
        messages.sort((m1, m2) -> {
            String date1 = (String) m1.get("timestamp");
            String date2 = (String) m2.get("timestamp");
            return date1.compareTo(date2);
        });
        
        return messages;
    }

    private List<Map<String, Object>> parseWhatsAppMessages(String content, List<String> mediaFiles, String bookId) {
        List<Map<String, Object>> messages = new ArrayList<>();
        
        // Pattern pour les messages WhatsApp: [DD/MM/YYYY, HH:MM:SS] Sender: Message
        Pattern pattern = Pattern.compile("\\[(\\d{2}/\\d{2}/\\d{4}), (\\d{2}:\\d{2}:\\d{2})\\] ([^:]+): (.*)");
        
        String[] lines = content.split("\n");
        
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty()) continue;
            
            Matcher matcher = pattern.matcher(line);
            if (matcher.find()) {
                Map<String, Object> message = new HashMap<>();
                message.put("id", UUID.randomUUID().toString());
                message.put("date", matcher.group(1));
                message.put("time", matcher.group(2));
                message.put("timestamp", matcher.group(1) + " " + matcher.group(2));
                message.put("sender", matcher.group(3));
                message.put("content", matcher.group(4));
                message.put("type", "text");
                
                // Vérifier si c'est un message média
                String messageContent = matcher.group(4);
                if (messageContent.contains("<Médias omis>") || messageContent.contains("<Media omitted>")) {
                    message.put("type", "media");
                    message.put("content", "📷 Photo");
                    
                    // Essayer de trouver le fichier média correspondant
                    String mediaUrl = findMatchingMedia(messageContent, mediaFiles, bookId);
                    if (mediaUrl != null) {
                        message.put("mediaUrl", mediaUrl);
                    }
                } else if (messageContent.contains("document omis") || messageContent.contains("document omitted")) {
                    message.put("type", "document");
                    message.put("content", "📄 Document");
                } else if (messageContent.contains("vidéo omise") || messageContent.contains("video omitted")) {
                    message.put("type", "video");
                    message.put("content", "🎥 Vidéo");
                    message.put("mediaUrl", frontendUrl + "/media/" + bookId + "/video_placeholder.mp4");
                }
                
                messages.add(message);
            }
        }
        
        return messages;
    }

    private String findMatchingMedia(String messageContent, List<String> mediaFiles, String bookId) {
        // Logique pour associer les messages aux fichiers média
        for (String mediaFile : mediaFiles) {
            if (mediaFile.toLowerCase().endsWith(".jpg") || 
                mediaFile.toLowerCase().endsWith(".jpeg") || 
                mediaFile.toLowerCase().endsWith(".png")) {
                return frontendUrl + "/api/media/" + bookId + "/" + mediaFile;
            }
        }
        return null;
    }

    private String generatePDF(List<Map<String, Object>> messages, Map<String, Object> bookConfig, String bookId) {
        // Générer le HTML pour le PDF
        String htmlContent = generateHTMLForPDF(messages, bookConfig);
        
        // Sauvegarder le HTML (pour le moment, en attendant une vraie génération PDF)
        Path pdfDir = Paths.get(storagePath, bookId);
        try {
            Files.createDirectories(pdfDir);
            Path htmlFile = pdfDir.resolve("book.html");
            Files.write(htmlFile, htmlContent.getBytes("UTF-8"));
            
            // TODO: Utiliser une librairie comme wkhtmltopdf ou Flying Saucer pour générer le PDF
            Path pdfFile = pdfDir.resolve("book.pdf");
            Files.write(pdfFile, "PDF simulé - voir book.html".getBytes("UTF-8"));
            
            return pdfFile.toString();
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }

    private String generateHTMLForPDF(List<Map<String, Object>> messages, Map<String, Object> bookConfig) {
        StringBuilder html = new StringBuilder();
        
        html.append("<!DOCTYPE html>\n");
        html.append("<html>\n<head>\n");
        html.append("<meta charset='UTF-8'>\n");
        html.append("<title>").append(bookConfig.getOrDefault("title", "Mon Livre Souvenir")).append("</title>\n");
        html.append("<style>\n");
        html.append(getChatBubbleCSS());
        html.append("</style>\n");
        html.append("</head>\n<body>\n");
        
        // Page de couverture
        html.append("<div class='cover-page'>\n");
        html.append("<h1>").append(bookConfig.getOrDefault("title", "Mon Livre Souvenir")).append("</h1>\n");
        html.append("<p class='subtitle'>").append(bookConfig.getOrDefault("subtitle", "Conversations précieuses")).append("</p>\n");
        html.append("</div>\n");
        
        // Messages
        html.append("<div class='chat-container'>\n");
        String currentDate = "";
        
        for (Map<String, Object> message : messages) {
            String messageDate = (String) message.get("date");
            
            // Nouveau jour
            if (!messageDate.equals(currentDate)) {
                currentDate = messageDate;
                html.append("<div class='date-separator'>").append(messageDate).append("</div>\n");
            }
            
            String sender = (String) message.get("sender");
            String content = (String) message.get("content");
            String time = (String) message.get("time");
            String type = (String) message.get("type");
            
            String bubbleClass = sender.equals("Vous") ? "message-sent" : "message-received";
            
            html.append("<div class='message ").append(bubbleClass).append("'>\n");
            html.append("<div class='message-content'>\n");
            
            if ("media".equals(type) && message.get("mediaUrl") != null) {
                html.append("<img src='").append(message.get("mediaUrl")).append("' alt='Image' class='message-image'>\n");
            } else if ("video".equals(type)) {
                html.append("<p>🎥 <a href='").append(message.get("mediaUrl")).append("'>Voir la vidéo</a></p>\n");
            } else {
                html.append("<p>").append(content).append("</p>\n");
            }
            
            html.append("</div>\n");
            html.append("<div class='message-time'>").append(time).append("</div>\n");
            html.append("</div>\n");
        }
        
        html.append("</div>\n");
        html.append("</body>\n</html>");
        
        return html.toString();
    }

    private String getChatBubbleCSS() {
        return """
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }
            
            .cover-page {
                text-align: center;
                padding: 100px 50px;
                page-break-after: always;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 80vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            
            .cover-page h1 {
                font-size: 3em;
                margin-bottom: 20px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            
            .subtitle {
                font-size: 1.5em;
                opacity: 0.9;
            }
            
            .chat-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .date-separator {
                text-align: center;
                margin: 30px 0;
                color: #666;
                font-size: 14px;
                position: relative;
            }
            
            .date-separator:before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: #ddd;
                z-index: 1;
            }
            
            .date-separator span {
                background: white;
                padding: 0 15px;
                position: relative;
                z-index: 2;
            }
            
            .message {
                margin-bottom: 15px;
                display: flex;
                flex-direction: column;
            }
            
            .message-sent {
                align-items: flex-end;
            }
            
            .message-received {
                align-items: flex-start;
            }
            
            .message-content {
                max-width: 70%;
                padding: 12px 16px;
                border-radius: 18px;
                position: relative;
                word-wrap: break-word;
            }
            
            .message-sent .message-content {
                background: #007AFF;
                color: white;
                border-bottom-right-radius: 4px;
            }
            
            .message-received .message-content {
                background: #E9E9EB;
                color: black;
                border-bottom-left-radius: 4px;
            }
            
            .message-content p {
                margin: 0;
                line-height: 1.4;
            }
            
            .message-image {
                max-width: 200px;
                border-radius: 8px;
                margin: 5px 0;
            }
            
            .message-time {
                font-size: 12px;
                color: #666;
                margin-top: 5px;
                padding: 0 16px;
            }
            
            @media print {
                body { -webkit-print-color-adjust: exact; }
            }
            """;
    }

    private boolean isTextFile(String fileName) {
        return fileName.toLowerCase().endsWith(".txt") || 
               fileName.toLowerCase().endsWith(".csv");
    }

    private boolean isMediaFile(String fileName) {
        String lower = fileName.toLowerCase();
        return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || 
               lower.endsWith(".png") || lower.endsWith(".gif") ||
               lower.endsWith(".mp4") || lower.endsWith(".mov") ||
               lower.endsWith(".webp");
    }

    private void createStorageDirectories() throws IOException {
        Files.createDirectories(Paths.get(storagePath));
        Files.createDirectories(Paths.get(mediaStoragePath));
    }

    private String generateBookId() {
        return "book_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    public Map<String, Object> getBookStatus(String bookId) {
        Map<String, Object> status = new HashMap<>();
        Path bookPath = Paths.get(storagePath, bookId);
        
        if (Files.exists(bookPath)) {
            status.put("status", "completed");
            status.put("bookId", bookId);
        } else {
            status.put("status", "not_found");
        }
        
        return status;
    }

    public InputStream downloadBook(String bookId) throws IOException {
        Path pdfPath = Paths.get(storagePath, bookId, "book.pdf");
        if (Files.exists(pdfPath)) {
            return Files.newInputStream(pdfPath);
        }
        throw new FileNotFoundException("Livre non trouvé: " + bookId);
    }
}