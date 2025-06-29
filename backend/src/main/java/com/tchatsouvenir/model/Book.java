
package com.tchatsouvenir.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String subtitle;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookStatus status = BookStatus.DRAFT;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookFormat format = BookFormat.STANDARD;
    
    @Column(columnDefinition = "TEXT")
    private String coverImageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String design; // JSON string pour stocker le design
    
    @Column(columnDefinition = "TEXT")
    private String content; // JSON string pour stocker le contenu
    
    @Column(name = "fabrication_cost", precision = 10, scale = 2)
    private BigDecimal fabricationCost;
    
    @Column(name = "selling_price", precision = 10, scale = 2)
    private BigDecimal sellingPrice;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @Column(name = "assigned_printer_id")
    private Long assignedPrinterId;
    
    @Column(name = "download_path")
    private String downloadPath;
    
    @Column(name = "is_downloaded")
    private Boolean isDownloaded = false;
    
    public enum BookStatus {
        DRAFT, PROCESSING, PENDING_REVIEW, APPROVED, REJECTED, 
        ASSIGNED_TO_PRINTER, IN_PRODUCTION, COMPLETED, DELETED
    }
    
    public enum BookFormat {
        STANDARD, MEDIUM, PREMIUM
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Méthodes utilitaires
    public BigDecimal calculateMargin() {
        if (sellingPrice != null && fabricationCost != null) {
            return sellingPrice.subtract(fabricationCost);
        }
        return BigDecimal.ZERO;
    }
    
    public BigDecimal calculateMarginPercentage() {
        if (sellingPrice != null && fabricationCost != null && sellingPrice.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal margin = calculateMargin();
            return margin.divide(sellingPrice, 4, java.math.RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }
    
    public boolean isDeleted() {
        return deletedAt != null;
    }
}
