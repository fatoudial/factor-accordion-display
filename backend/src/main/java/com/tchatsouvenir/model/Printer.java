
package com.tchatsouvenir.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "printers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Printer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String email;
    
    @Column
    private String phone;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "standard_cost", precision = 10, scale = 2)
    private BigDecimal standardCost = BigDecimal.valueOf(8000);
    
    @Column(name = "medium_cost", precision = 10, scale = 2)
    private BigDecimal mediumCost = BigDecimal.valueOf(10000);
    
    @Column(name = "premium_cost", precision = 10, scale = 2)
    private BigDecimal premiumCost = BigDecimal.valueOf(15000);
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public BigDecimal getCostByFormat(Book.BookFormat format) {
        switch (format) {
            case MEDIUM: return mediumCost;
            case PREMIUM: return premiumCost;
            default: return standardCost;
        }
    }
}
