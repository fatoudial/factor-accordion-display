package com.tchatsouvenir.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "*")
public class MediaController {

    @Value("${app.media.path:./storage/media}")
    private String mediaStoragePath;

    @GetMapping("/{bookId}/{fileName}")
    public ResponseEntity<Resource> getMedia(@PathVariable String bookId, @PathVariable String fileName) {
        try {
            Path filePath = Paths.get(mediaStoragePath, bookId, fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Déterminer le type de contenu
                MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
                String fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
                
                switch (fileExtension) {
                    case "jpg":
                    case "jpeg":
                        mediaType = MediaType.IMAGE_JPEG;
                        break;
                    case "png":
                        mediaType = MediaType.IMAGE_PNG;
                        break;
                    case "gif":
                        mediaType = MediaType.IMAGE_GIF;
                        break;
                    case "webp":
                        mediaType = MediaType.valueOf("image/webp");
                        break;
                    case "mp4":
                        mediaType = MediaType.valueOf("video/mp4");
                        break;
                    case "mov":
                        mediaType = MediaType.valueOf("video/quicktime");
                        break;
                }

                return ResponseEntity.ok()
                        .contentType(mediaType)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}