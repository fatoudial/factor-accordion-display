//package com.tchatsouvenir.service;
//
//import io.minio.MinioClient;
//import io.minio.PutObjectArgs;
//import io.minio.GetObjectArgs;
//import io.minio.RemoveObjectArgs;
//import io.minio.MakeBucketArgs;
//import io.minio.BucketExistsArgs;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//import java.io.*;
//import java.util.zip.ZipEntry;
//import java.util.zip.ZipInputStream;
//import java.util.zip.ZipOutputStream;
//import java.util.Map;
//import java.util.HashMap;
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//
//@Service
//public class BookGenerationService {
//
//    private final MinioClient minioClient;
//
//    @Value("${minio.url:http://localhost:9000}")
//    private String minioUrl;
//
//    @Value("${minio.access-key:minioadmin}")
//    private String accessKey;
//
//    @Value("${minio.secret-key:minioadmin}")
//    private String secretKey;
//
//    @Value("${minio.bucket-name:tchat-souvenir-books}")
//    private String bucketName;
//
//    public BookGenerationService() {
//        // Initialisation du client Minio
//        this.minioClient = MinioClient.builder()
//                .endpoint(minioUrl != null ? minioUrl : "http://localhost:9000")
//                .credentials(
//                    accessKey != null ? accessKey : "minioadmin",
//                    secretKey != null ? secretKey : "minioadmin"
//                )
//                .build();
//
//        // Créer le bucket s'il n'existe pas
//        try {
//            createBucketIfNotExists();
//        } catch (Exception e) {
//            System.err.println("Erreur lors de l'initialisation Minio: " + e.getMessage());
//        }
//    }
//
//    public Map<String, Object> generateBookFromZip(MultipartFile zipFile, String userId, Map<String, Object> bookConfig) {
//        Map<String, Object> result = new HashMap<>();
//        String bookId = generateBookId();
//
//        try {
//            // 1. Extraire et analyser le contenu du ZIP
//            Map<String, Object> extractedContent = extractZipContent(zipFile);
//
//            // 2. Traiter les messages/conversations
//            Map<String, Object> processedMessages = processMessages(extractedContent);
//
//            // 3. Générer les pages du livre
//            Map<String, Object> bookPages = generateBookPages(processedMessages, bookConfig);
//
//            // 4. Créer le livre final (PDF ou autre format)
//            String bookUrl = createFinalBook(bookPages, bookId, userId);
//
//            // 5. Sauvegarder les métadonnées
//            saveBookMetadata(bookId, userId, bookConfig, processedMessages);
//
//            result.put("success", true);
//            result.put("bookId", bookId);
//            result.put("bookUrl", bookUrl);
//            result.put("message", "Livre généré avec succès");
//            result.put("pages", ((Map<?, ?>) bookPages).size());
//            result.put("createdAt", LocalDateTime.now().toString());
//
//        } catch (Exception e) {
//            result.put("success", false);
//            result.put("error", "Erreur lors de la génération du livre: " + e.getMessage());
//            result.put("bookId", bookId);
//        }
//
//        return result;
//    }
//
//    private Map<String, Object> extractZipContent(MultipartFile zipFile) throws IOException {
//        Map<String, Object> content = new HashMap<>();
//        Map<String, String> files = new HashMap<>();
//
//        try (ZipInputStream zis = new ZipInputStream(zipFile.getInputStream())) {
//            ZipEntry entry;
//            while ((entry = zis.readNextEntry()) != null) {
//                if (!entry.isDirectory()) {
//                    String fileName = entry.getName();
//                    String fileContent = readZipEntryContent(zis);
//                    files.put(fileName, fileContent);
//                }
//            }
//        }
//
//        content.put("files", files);
//        content.put("originalFileName", zipFile.getOriginalFilename());
//        content.put("size", zipFile.getSize());
//
//        return content;
//    }
//
//    private String readZipEntryContent(ZipInputStream zis) throws IOException {
//        ByteArrayOutputStream baos = new ByteArrayOutputStream();
//        byte[] buffer = new byte[1024];
//        int length;
//        while ((length = zis.read(buffer)) != -1) {
//            baos.write(buffer, 0, length);
//        }
//        return baos.toString("UTF-8");
//    }
//
//    private Map<String, Object> processMessages(Map<String, Object> extractedContent) {
//        Map<String, Object> processed = new HashMap<>();
//        Map<String, String> files = (Map<String, String>) extractedContent.get("files");
//
//        // Simuler le traitement des messages (JSON, TXT, etc.)
//        int messageCount = 0;
//        for (Map.Entry<String, String> file : files.entrySet()) {
//            String fileName = file.getKey();
//            String content = file.getValue();
//
//            if (fileName.endsWith(".json") || fileName.endsWith(".txt")) {
//                // Ici on pourrait parser les vrais messages
//                messageCount += content.split("\n").length;
//            }
//        }
//
//        processed.put("totalMessages", messageCount);
//        processed.put("conversationFiles", files.size());
//        processed.put("estimatedPages", Math.max(10, messageCount / 50)); // 50 messages par page
//
//        return processed;
//    }
//
//    private Map<String, Object> generateBookPages(Map<String, Object> processedMessages, Map<String, Object> bookConfig) {
//        Map<String, Object> pages = new HashMap<>();
//
//        int totalPages = (Integer) processedMessages.get("estimatedPages");
//
//        // Générer les pages simulées
//        for (int i = 1; i <= totalPages; i++) {
//            Map<String, Object> page = new HashMap<>();
//            page.put("pageNumber", i);
//            page.put("content", "Contenu de la page " + i);
//            page.put("type", i == 1 ? "cover" : i == totalPages ? "back" : "content");
//            pages.put("page_" + i, page);
//        }
//
//        return pages;
//    }
//
//    private String createFinalBook(Map<String, Object> bookPages, String bookId, String userId) throws Exception {
//        // Créer un PDF simulé (ou autre format)
//        ByteArrayOutputStream pdfStream = new ByteArrayOutputStream();
//
//        // Ici on générerait un vrai PDF avec les pages
//        String pdfContent = "Livre généré - ID: " + bookId + "\nPages: " + bookPages.size();
//        pdfStream.write(pdfContent.getBytes());
//
//        // Upload vers Minio
//        String objectName = "books/" + userId + "/" + bookId + ".pdf";
//
//        minioClient.putObject(PutObjectArgs.builder()
//                .bucket(bucketName)
//                .object(objectName)
//                .stream(new ByteArrayInputStream(pdfStream.toByteArray()), pdfStream.size(), -1)
//                .contentType("application/pdf")
//                .build());
//
//        return minioUrl + "/" + bucketName + "/" + objectName;
//    }
//
//    private void saveBookMetadata(String bookId, String userId, Map<String, Object> config, Map<String, Object> messages) throws Exception {
//        Map<String, Object> metadata = new HashMap<>();
//        metadata.put("bookId", bookId);
//        metadata.put("userId", userId);
//        metadata.put("config", config);
//        metadata.put("messages", messages);
//        metadata.put("createdAt", LocalDateTime.now().toString());
//
//        // Sauvegarder les métadonnées en JSON
//        String metadataJson = mapToJson(metadata);
//        String objectName = "metadata/" + userId + "/" + bookId + ".json";
//
//        minioClient.putObject(PutObjectArgs.builder()
//                .bucket(bucketName)
//                .object(objectName)
//                .stream(new ByteArrayInputStream(metadataJson.getBytes()), metadataJson.length(), -1)
//                .contentType("application/json")
//                .build());
//    }
//
//    private void createBucketIfNotExists() throws Exception {
//        boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
//        if (!bucketExists) {
//            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
//        }
//    }
//
//    private String generateBookId() {
//        return "BOOK-" + System.currentTimeMillis() + "-" +
//               LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
//    }
//
//    private String mapToJson(Map<String, Object> map) {
//        // Conversion simple Map -> JSON (dans un vrai projet, utiliser Jackson)
//        StringBuilder json = new StringBuilder("{");
//        map.forEach((key, value) -> {
//            json.append("\"").append(key).append("\":\"").append(value.toString()).append("\",");
//        });
//        if (json.length() > 1) {
//            json.setLength(json.length() - 1); // Enlever la dernière virgule
//        }
//        json.append("}");
//        return json.toString();
//    }
//
//    public Map<String, Object> getBookStatus(String bookId) {
//        Map<String, Object> status = new HashMap<>();
//        try {
//            // Vérifier si le livre existe dans Minio
//            String objectName = "books/*/" + bookId + ".pdf";
//            // Ici on ferait une vraie vérification
//            status.put("exists", true);
//            status.put("status", "completed");
//            status.put("bookId", bookId);
//        } catch (Exception e) {
//            status.put("exists", false);
//            status.put("error", e.getMessage());
//        }
//        return status;
//    }
//
//    public InputStream downloadBook(String bookId, String userId) throws Exception {
//        String objectName = "books/" + userId + "/" + bookId + ".pdf";
//        return minioClient.getObject(GetObjectArgs.builder()
//                .bucket(bucketName)
//                .object(objectName)
//                .build());
//    }
//}