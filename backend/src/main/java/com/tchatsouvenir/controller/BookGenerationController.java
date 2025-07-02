//package com.tchatsouvenir.controller;
//
//import com.tchatsouvenir.service.BookGenerationService;
//import com.tchatsouvenir.service.JwtService;
//import com.tchatsouvenir.service.UserService;
//import com.tchatsouvenir.model.User;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import java.io.InputStream;
//import java.util.Map;
//import java.util.HashMap;
//
//@RestController
//@RequestMapping("/api/books")
//@CrossOrigin(origins = "*")
//@Tag(name = "Book Generation", description = "API de génération de livres")
//public class BookGenerationController {
//
//    @Autowired
//    private BookGenerationService bookGenerationService;
//
//    @Autowired
//    private JwtService jwtService;
//
//    @Autowired
//    private UserService userService;
//
//    @PostMapping("/generate")
//    @Operation(summary = "Générer un livre à partir d'un ZIP",
//               description = "Upload d'un fichier ZIP contenant les conversations et génération automatique du livre")
//    public ResponseEntity<Map<String, Object>> generateBook(
//            @RequestHeader("Authorization") String token,
//            @RequestParam("file") MultipartFile file,
//            @RequestParam(value = "title", required = false, defaultValue = "Mon Livre Souvenir") String title,
//            @RequestParam(value = "format", required = false, defaultValue = "pdf") String format,
//            @RequestParam(value = "style", required = false, defaultValue = "modern") String style) {
//
//        try {
//            // Vérifier l'utilisateur
//            User user = getCurrentUser(token);
//
//            // Vérifier le fichier
//            if (file.isEmpty()) {
//                Map<String, Object> error = new HashMap<>();
//                error.put("success", false);
//                error.put("error", "Fichier ZIP requis");
//                return ResponseEntity.badRequest().body(error);
//            }
//
//            if (!file.getOriginalFilename().toLowerCase().endsWith(".zip")) {
//                Map<String, Object> error = new HashMap<>();
//                error.put("success", false);
//                error.put("error", "Seuls les fichiers ZIP sont acceptés");
//                return ResponseEntity.badRequest().body(error);
//            }
//
//            // Configuration du livre
//            Map<String, Object> bookConfig = new HashMap<>();
//            bookConfig.put("title", title);
//            bookConfig.put("format", format);
//            bookConfig.put("style", style);
//            bookConfig.put("userId", user.getId());
//            bookConfig.put("userEmail", user.getEmail());
//
//            // Générer le livre
//            Map<String, Object> result = bookGenerationService.generateBookFromZip(file, user.getId().toString(), bookConfig);
//
//            return ResponseEntity.ok(result);
//
//        } catch (Exception e) {
//            Map<String, Object> error = new HashMap<>();
//            error.put("success", false);
//            error.put("error", "Erreur lors de la génération: " + e.getMessage());
//            return ResponseEntity.internalServerError().body(error);
//        }
//    }
//
//    @GetMapping("/status/{bookId}")
//    @Operation(summary = "Vérifier le statut d'un livre")
//    public ResponseEntity<Map<String, Object>> getBookStatus(@PathVariable String bookId) {
//        Map<String, Object> status = bookGenerationService.getBookStatus(bookId);
//        return ResponseEntity.ok(status);
//    }
//
//    @GetMapping("/download/{bookId}")
//    @Operation(summary = "Télécharger un livre généré")
//    public ResponseEntity<byte[]> downloadBook(
//            @RequestHeader("Authorization") String token,
//            @PathVariable String bookId) {
//
//        try {
//            User user = getCurrentUser(token);
//            InputStream bookStream = bookGenerationService.downloadBook(bookId, user.getId().toString());
//
//            byte[] bookData = bookStream.readAllBytes();
//            bookStream.close();
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_PDF);
//            headers.setContentDispositionFormData("attachment", "livre-" + bookId + ".pdf");
//
//            return ResponseEntity.ok()
//                    .headers(headers)
//                    .body(bookData);
//
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @PostMapping("/preview")
//    @Operation(summary = "Aperçu rapide du contenu d'un ZIP")
//    public ResponseEntity<Map<String, Object>> previewZipContent(
//            @RequestHeader("Authorization") String token,
//            @RequestParam("file") MultipartFile file) {
//
//        try {
//            User user = getCurrentUser(token);
//
//            if (file.isEmpty() || !file.getOriginalFilename().toLowerCase().endsWith(".zip")) {
//                Map<String, Object> error = new HashMap<>();
//                error.put("success", false);
//                error.put("error", "Fichier ZIP requis");
//                return ResponseEntity.badRequest().body(error);
//            }
//
//            // Analyser le ZIP sans génération complète
//            Map<String, Object> preview = new HashMap<>();
//            preview.put("success", true);
//            preview.put("filename", file.getOriginalFilename());
//            preview.put("size", file.getSize());
//            preview.put("message", "Aperçu du contenu disponible");
//            preview.put("estimatedProcessingTime", "2-5 minutes");
//
//            return ResponseEntity.ok(preview);
//
//        } catch (Exception e) {
//            Map<String, Object> error = new HashMap<>();
//            error.put("success", false);
//            error.put("error", "Erreur lors de l'aperçu: " + e.getMessage());
//            return ResponseEntity.internalServerError().body(error);
//        }
//    }
//
//    private User getCurrentUser(String token) {
//        try {
//            String jwt = token.substring(7); // Enlever "Bearer "
//            String email = jwtService.extractUsername(jwt);
//
//            return userService.getUserByEmail(email)
//                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
//        } catch (Exception e) {
//            throw new RuntimeException("Token invalide: " + e.getMessage());
//        }
//    }
//}