
package com.tchatsouvenir.repository;

import com.tchatsouvenir.model.Book;
import com.tchatsouvenir.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    List<Book> findByUserAndDeletedAtIsNull(User user);
    
    List<Book> findByDeletedAtIsNull();
    
    List<Book> findByDeletedAtIsNotNull();
    
    List<Book> findByStatus(Book.BookStatus status);
    
    List<Book> findByStatusAndDeletedAtIsNull(Book.BookStatus status);
    
    @Query("SELECT b FROM Book b WHERE b.deletedAt IS NULL AND b.createdAt BETWEEN :startDate AND :endDate")
    List<Book> findByCreatedAtBetweenAndDeletedAtIsNull(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT b FROM Book b WHERE b.deletedAt IS NULL AND (:status IS NULL OR b.status = :status) AND (:format IS NULL OR b.format = :format)")
    List<Book> findWithFilters(@Param("status") Book.BookStatus status, @Param("format") Book.BookFormat format);
    
    @Query("SELECT COUNT(b) FROM Book b WHERE b.deletedAt IS NULL")
    long countActiveBooks();
    
    @Query("SELECT COUNT(b) FROM Book b WHERE b.status = :status AND b.deletedAt IS NULL")
    long countByStatusAndDeletedAtIsNull(@Param("status") Book.BookStatus status);
    
    @Query("SELECT SUM(b.sellingPrice - b.fabricationCost) FROM Book b WHERE b.deletedAt IS NULL AND b.sellingPrice IS NOT NULL AND b.fabricationCost IS NOT NULL")
    Optional<java.math.BigDecimal> calculateTotalMargin();
    
    @Query("SELECT SUM(b.sellingPrice - b.fabricationCost) FROM Book b WHERE b.deletedAt IS NULL AND b.createdAt BETWEEN :startDate AND :endDate AND b.sellingPrice IS NOT NULL AND b.fabricationCost IS NOT NULL")
    Optional<java.math.BigDecimal> calculateMarginByPeriod(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
