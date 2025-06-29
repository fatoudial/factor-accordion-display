
package com.tchatsouvenir.repository;

import com.tchatsouvenir.model.CartItem;
import com.tchatsouvenir.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProductId(User user, String productId);
    void deleteByUser(User user);
    
    @Query("SELECT SUM(ci.quantity * ci.unitPrice) FROM CartItem ci WHERE ci.user = :user")
    Double calculateCartTotal(@Param("user") User user);
    
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.user = :user")
    Long countByUser(@Param("user") User user);
}
