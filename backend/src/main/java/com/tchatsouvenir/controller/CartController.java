//
//package com.tchatsouvenir.controller;
//
//import com.tchatsouvenir.model.CartItem;
//import com.tchatsouvenir.model.User;
//import com.tchatsouvenir.service.CartService;
//import com.tchatsouvenir.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import java.math.BigDecimal;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/cart")
//@CrossOrigin(origins = "*")
//public class CartController {
//
//    @Autowired
//    private CartService cartService;
//
//    @Autowired
//    private UserService userService;
//
//    @GetMapping
//    public ResponseEntity<List<CartItem>> getCartItems(@RequestHeader("Authorization") String token) {
//        User user = getCurrentUser(token);
//        List<CartItem> items = cartService.getCartItems(user);
//        return ResponseEntity.ok(items);
//    }
//
//    @PostMapping("/add")
//    public ResponseEntity<CartItem> addToCart(@RequestHeader("Authorization") String token,
//                                              @RequestBody Map<String, Object> request) {
//        User user = getCurrentUser(token);
//
//        String productId = (String) request.get("productId");
//        String productName = (String) request.get("productName");
//        Integer quantity = (Integer) request.get("quantity");
//        BigDecimal unitPrice = new BigDecimal(request.get("unitPrice").toString());
//        String bookFormat = (String) request.get("bookFormat");
//        String imageUrl = (String) request.get("imageUrl");
//
//        CartItem item = cartService.addToCart(user, productId, productName, quantity, unitPrice, bookFormat, imageUrl);
//        return ResponseEntity.ok(item);
//    }
//
//    @PutMapping("/{itemId}")
//    public ResponseEntity<CartItem> updateCartItem(@RequestHeader("Authorization") String token,
//                                                   @PathVariable Long itemId,
//                                                   @RequestBody Map<String, Integer> request) {
//        User user = getCurrentUser(token);
//        Integer newQuantity = request.get("quantity");
//
//        CartItem updatedItem = cartService.updateCartItem(user, itemId, newQuantity);
//        return ResponseEntity.ok(updatedItem);
//    }
//
//    @DeleteMapping("/{itemId}")
//    public ResponseEntity<Void> removeFromCart(@RequestHeader("Authorization") String token,
//                                               @PathVariable Long itemId) {
//        User user = getCurrentUser(token);
//        cartService.removeFromCart(user, itemId);
//        return ResponseEntity.noContent().build();
//    }
//
//    @DeleteMapping("/clear")
//    public ResponseEntity<Void> clearCart(@RequestHeader("Authorization") String token) {
//        User user = getCurrentUser(token);
//        cartService.clearCart(user);
//        return ResponseEntity.noContent().build();
//    }
//
//    @GetMapping("/summary")
//    public ResponseEntity<Map<String, Object>> getCartSummary(@RequestHeader("Authorization") String token) {
//        User user = getCurrentUser(token);
//
//        BigDecimal total = cartService.getCartTotal(user);
//        Long itemCount = cartService.getCartItemCount(user);
//
//        Map<String, Object> summary = Map.of(
//                "total", total,
//                "itemCount", itemCount,
//                "shippingCost", BigDecimal.valueOf(2500), // Frais de livraison fixes
//                "grandTotal", total.add(BigDecimal.valueOf(2500))
//        );
//
//        return ResponseEntity.ok(summary);
//    }
//
//    private User getCurrentUser(String token) {
//        // Extraction du token JWT et récupération de l'utilisateur
//        // Pour la démo, on utilise un utilisateur par défaut
//        return userService.getUserByEmail("user@example.com")
//                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
//    }
//}
