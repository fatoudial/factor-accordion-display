
package com.tchatsouvenir.service;

import com.tchatsouvenir.model.Book;
import com.tchatsouvenir.model.User;
import com.tchatsouvenir.model.Printer;
import com.tchatsouvenir.model.PrinterOrder;
import com.tchatsouvenir.model.Order;
import com.tchatsouvenir.repository.BookRepository;
import com.tchatsouvenir.repository.PrinterRepository;
import com.tchatsouvenir.repository.PrinterOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@Service
@Transactional
public class BookService {
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private PrinterRepository printerRepository;
    
    @Autowired
    private PrinterOrderRepository printerOrderRepository;
    
    public List<Book> getAllActiveBooks() {
        return bookRepository.findByDeletedAtIsNull();
    }
    
    public List<Book> getBooksByUser(User user) {
        return bookRepository.findByUserAndDeletedAtIsNull(user);
    }
    
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id).filter(book -> !book.isDeleted());
    }
    
    public List<Book> getBooksByPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        return bookRepository.findByCreatedAtBetweenAndDeletedAtIsNull(startDate, endDate);
    }
    
    public List<Book> getBooksByFilters(Book.BookStatus status, Book.BookFormat format) {
        return bookRepository.findWithFilters(status, format);
    }
    
    public Book saveBook(Book book) {
        // Calculer le coût de fabrication basé sur le format
        if (book.getFabricationCost() == null) {
            BigDecimal cost = calculateFabricationCost(book.getFormat());
            book.setFabricationCost(cost);
        }
        return bookRepository.save(book);
    }
    
    public Book updateBook(Book book) {
        book.setUpdatedAt(LocalDateTime.now());
        return bookRepository.save(book);
    }
    
    public void softDeleteBook(Long bookId) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            book.setDeletedAt(LocalDateTime.now());
            book.setStatus(Book.BookStatus.DELETED);
            bookRepository.save(book);
        }
    }
    
    public void permanentDeleteBook(Long bookId) {
        bookRepository.deleteById(bookId);
    }
    
    public List<Book> getDeletedBooks() {
        return bookRepository.findByDeletedAtIsNotNull();
    }
    
    public void restoreBook(Long bookId) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            book.setDeletedAt(null);
            book.setStatus(Book.BookStatus.DRAFT);
            bookRepository.save(book);
        }
    }
    
    public Book assignToPrinter(Long bookId, Long printerId, Order order) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        Optional<Printer> printerOpt = printerRepository.findById(printerId);
        
        if (bookOpt.isPresent() && printerOpt.isPresent()) {
            Book book = bookOpt.get();
            Printer printer = printerOpt.get();
            
            book.setAssignedPrinterId(printerId);
            book.setStatus(Book.BookStatus.ASSIGNED_TO_PRINTER);
            book = bookRepository.save(book);
            
            // Créer une commande d'imprimeur
            PrinterOrder printerOrder = new PrinterOrder();
            printerOrder.setPrinter(printer);
            printerOrder.setBook(book);
            printerOrder.setOrder(order);
            printerOrder.setCost(printer.getCostByFormat(book.getFormat()));
            printerOrder.setStatus(PrinterOrder.PrinterOrderStatus.ASSIGNED);
            printerOrderRepository.save(printerOrder);
            
            return book;
        }
        throw new RuntimeException("Livre ou imprimeur non trouvé");
    }
    
    public Book markAsDownloaded(Long bookId, String downloadPath) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            book.setIsDownloaded(true);
            book.setDownloadPath(downloadPath);
            book.setProcessedAt(LocalDateTime.now());
            return bookRepository.save(book);
        }
        throw new RuntimeException("Livre non trouvé");
    }
    
    private BigDecimal calculateFabricationCost(Book.BookFormat format) {
        switch (format) {
            case MEDIUM: return BigDecimal.valueOf(10000);
            case PREMIUM: return BigDecimal.valueOf(15000);
            default: return BigDecimal.valueOf(8000);
        }
    }
    
    // Méthodes pour les statistiques et marges
    public BigDecimal calculateTotalMargin() {
        return bookRepository.calculateTotalMargin().orElse(BigDecimal.ZERO);
    }
    
    public BigDecimal calculateMarginByPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        return bookRepository.calculateMarginByPeriod(startDate, endDate).orElse(BigDecimal.ZERO);
    }
    
    public long getTotalActiveBooks() {
        return bookRepository.countActiveBooks();
    }
    
    public long getBooksByStatus(Book.BookStatus status) {
        return bookRepository.countByStatusAndDeletedAtIsNull(status);
    }
}
