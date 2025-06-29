
package com.tchatsouvenir.service;

import com.tchatsouvenir.model.CartItem;
import com.tchatsouvenir.model.User;
import com.tchatsouvenir.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartService {
    
    @Autowired
    private CartItemRepository cartItemRepository;

    public List<CartItem> getCartItems(User user) {
        return cartItemRepository.findByUser(user);
    }

    public CartItem addToCart(User user, String productId, String productName, 
                             Integer quantity, BigDecimal unitPrice, String bookFormat, String imageUrl) {
        Optional<CartItem> existingItem = cartItemRepository.findByUserAndProductId(user, productId);
        
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProductId(productId);
            newItem.setProductName(productName);
            newItem.setQuantity(quantity);
            newItem.setUnitPrice(unitPrice);
            newItem.setBookFormat(bookFormat);
            newItem.setImageUrl(imageUrl);
            return cartItemRepository.save(newItem);
        }
    }

    public CartItem updateCartItem(User user, Long itemId, Integer newQuantity) {
        CartItem item = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Article non trouvé"));
        
        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Accès non autorisé à cet article");
        }
        
        if (newQuantity <= 0) {
            cartItemRepository.delete(item);
            return null;
        } else {
            item.setQuantity(newQuantity);
            return cartItemRepository.save(item);
        }
    }

    public void removeFromCart(User user, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Article non trouvé"));
        
        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Accès non autorisé à cet article");
        }
        
        cartItemRepository.delete(item);
    }

    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }

    public BigDecimal getCartTotal(User user) {
        Double total = cartItemRepository.calculateCartTotal(user);
        return total != null ? BigDecimal.valueOf(total) : BigDecimal.ZERO;
    }

    public Long getCartItemCount(User user) {
        return cartItemRepository.countByUser(user);
    }
}
