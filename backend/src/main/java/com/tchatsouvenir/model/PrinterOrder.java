
package com.tchatsouvenir.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "printer_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrinterOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "printer_id", nullable = false)
    private Printer printer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @Column(name = "cost", precision = 10, scale = 2, nullable = false)
    private BigDecimal cost;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PrinterOrderStatus status = PrinterOrderStatus.PENDING;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    public enum PrinterOrderStatus {
        PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
    }
    
    @PreUpdate
    public void preUpdate() {
        if (status == PrinterOrderStatus.ASSIGNED && assignedAt == null) {
            assignedAt = LocalDateTime.now();
        }
        if (status == PrinterOrderStatus.COMPLETED && completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }
}
