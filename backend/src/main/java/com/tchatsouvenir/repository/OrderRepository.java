
package com.tchatsouvenir.repository;

import com.tchatsouvenir.model.Order;
import com.tchatsouvenir.model.OrderStatus;
import com.tchatsouvenir.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByStatus(OrderStatus status);
    Optional<Order> findByOrderReference(String orderReference);
    
    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:dateFrom IS NULL OR o.createdAt >= :dateFrom) AND " +
           "(:dateTo IS NULL OR o.createdAt <= :dateTo) AND " +
           "(:search IS NULL OR LOWER(o.orderReference) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(o.user.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(o.user.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:bookFormat IS NULL OR o.bookFormat = :bookFormat) AND " +
           "(:paymentMethod IS NULL OR o.paymentMethod = :paymentMethod)")
    List<Order> findWithFilters(@Param("status") OrderStatus status,
                               @Param("dateFrom") LocalDateTime dateFrom,
                               @Param("dateTo") LocalDateTime dateTo,
                               @Param("search") String search,
                               @Param("bookFormat") String bookFormat,
                               @Param("paymentMethod") String paymentMethod);
}
