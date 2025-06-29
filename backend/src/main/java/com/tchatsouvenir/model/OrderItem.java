
package com.tchatsouvenir.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "product_id")
    private String productId;

    @NotNull
    private String name;

    @NotNull
    @Positive
    private Integer quantity;

    @NotNull
    @Positive
    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    @Column(name = "book_format")
    private String bookFormat;

    @Column(name = "book_cover_type")
    private String bookCoverType;

    @Column(name = "image_url")
    private String imageUrl;

    // Constructeurs
    public OrderItem() {}

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public String getBookFormat() { return bookFormat; }
    public void setBookFormat(String bookFormat) { this.bookFormat = bookFormat; }

    public String getBookCoverType() { return bookCoverType; }
    public void setBookCoverType(String bookCoverType) { this.bookCoverType = bookCoverType; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
