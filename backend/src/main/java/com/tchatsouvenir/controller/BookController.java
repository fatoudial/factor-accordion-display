
package com.tchatsouvenir.controller;

import com.tchatsouvenir.model.Book;
import com.tchatsouvenir.model.User;
import com.tchatsouvenir.service.BookService;
import com.tchatsouvenir.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {
    
    @Autowired
    private BookService bookService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) Book.BookStatus status,
            @RequestParam(required = false) Book.BookFormat format) {
        
        List<Book> books;
        
        if (startDate != null && endDate != null) {
            books = bookService.getBooksByPeriod(startDate, endDate);
        } else if (status != null || format != null) {
            books = bookService.getBooksByFilters(status, format);
        } else {
            books = bookService.getAllActiveBooks();
        }
        
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Optional<Book> book = bookService.getBookById(id);
        return book.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book, @RequestHeader("Authorization") String token) {
        User user = getCurrentUser(token);
        book.setUser(user);
        Book savedBook = bookService.saveBook(book);
        return ResponseEntity.ok(savedBook);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        book.setId(id);
        Book updatedBook = bookService.updateBook(book);
        return ResponseEntity.ok(updatedBook);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.softDeleteBook(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/restore")
    public ResponseEntity<Void> restoreBook(@PathVariable Long id) {
        bookService.restoreBook(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/deleted")
    public ResponseEntity<List<Book>> getDeletedBooks() {
        List<Book> deletedBooks = bookService.getDeletedBooks();
        return ResponseEntity.ok(deletedBooks);
    }
    
    @PostMapping("/{bookId}/assign-printer/{printerId}")
    public ResponseEntity<Book> assignToPrinter(@PathVariable Long bookId, @PathVariable Long printerId) {
        // Pour simplifier, on passe null pour order, à améliorer plus tard
        Book book = bookService.assignToPrinter(bookId, printerId, null);
        return ResponseEntity.ok(book);
    }
    
    @PostMapping("/{id}/mark-downloaded")
    public ResponseEntity<Book> markAsDownloaded(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String downloadPath = request.get("downloadPath");
        Book book = bookService.markAsDownloaded(id, downloadPath);
        return ResponseEntity.ok(book);
    }
    
    @GetMapping("/stats/margins")
    public ResponseEntity<Map<String, Object>> getMarginStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        BigDecimal totalMargin;
        if (startDate != null && endDate != null) {
            totalMargin = bookService.calculateMarginByPeriod(startDate, endDate);
        } else {
            totalMargin = bookService.calculateTotalMargin();
        }
        
        long totalBooks = bookService.getTotalActiveBooks();
        long pendingBooks = bookService.getBooksByStatus(Book.BookStatus.PENDING_REVIEW);
        long completedBooks = bookService.getBooksByStatus(Book.BookStatus.COMPLETED);
        
        Map<String, Object> stats = Map.of(
            "totalMargin", totalMargin,
            "totalBooks", totalBooks,
            "pendingBooks", pendingBooks,
            "completedBooks", completedBooks
        );
        
        return ResponseEntity.ok(stats);
    }
    
    private User getCurrentUser(String token) {
        // Extraction du token JWT et récupération de l'utilisateur
        // Pour la démo, on utilise un utilisateur par défaut
        return userService.findByEmail("user@example.com")
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }
}
