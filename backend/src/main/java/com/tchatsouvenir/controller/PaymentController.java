//package com.tchatsouvenir.controller;
//
//import com.tchatsouvenir.model.Payment;
//import com.tchatsouvenir.model.Order;
//import com.tchatsouvenir.model.User;
//import com.tchatsouvenir.service.PaymentService;
//import com.tchatsouvenir.service.OrderService;
//import com.tchatsouvenir.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import java.math.BigDecimal;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/payments")
//@CrossOrigin(origins = "*")
//public class PaymentController {
//
//    @Autowired
//    private PaymentService paymentService;
//
//    @Autowired
//    private OrderService orderService;
//
//    @Autowired
//    private UserService userService;
//
//    @PostMapping("/initiate")
//    public ResponseEntity<Map<String, Object>> initiatePayment(
//            @RequestHeader("Authorization") String token,
//            @RequestBody Map<String, Object> request) {
//
//        User user = getCurrentUser(token);
//
//        Long orderId = Long.valueOf(request.get("orderId").toString());
//        BigDecimal amount = new BigDecimal(request.get("amount").toString());
//        String paymentMethod = (String) request.get("method");
//        String provider = (String) request.get("provider");
//        String phoneNumber = (String) request.get("phoneNumber");
//
//        Order order = orderService.getOrderById(orderId)
//                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
//
//        Payment payment = paymentService.createPayment(user, order, amount, paymentMethod, provider, phoneNumber);
//
//        // Pour mobile money, on lance le processus de paiement
//        if ("mobile_money".equals(paymentMethod)) {
//            // Traitement asynchrone du paiement mobile money
//            new Thread(() -> paymentService.processMobileMoneyPayment(payment)).start();
//        }
//
//        Map<String, Object> response = Map.of(
//                "success", true,
//                "transactionId", payment.getTransactionId(),
//                "status", payment.getStatus().toString(),
//                "message", "Paiement initié avec succès"
//        );
//
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping("/status/{transactionId}")
//    public ResponseEntity<Map<String, Object>> checkPaymentStatus(@PathVariable String transactionId) {
//        Optional<Payment> paymentOpt = paymentService.getPaymentByTransactionId(transactionId);
//
//        if (paymentOpt.isPresent()) {
//            Payment payment = paymentOpt.get();
//            Map<String, Object> response = Map.of(
//                    "success", true,
//                    "transactionId", payment.getTransactionId(),
//                    "status", payment.getStatus().toString(),
//                    "amount", payment.getAmount(),
//                    "method", payment.getPaymentMethod(),
//                    "completedAt", payment.getCompletedAt()
//            );
//            return ResponseEntity.ok(response);
//        } else {
//            Map<String, Object> response = Map.of(
//                    "success", false,
//                    "message", "Transaction non trouvée"
//            );
//            return ResponseEntity.badRequest().body(response);
//        }
//    }
//
//    @GetMapping("/history")
//    public ResponseEntity<List<Payment>> getPaymentHistory(@RequestHeader("Authorization") String token) {
//        User user = getCurrentUser(token);
//        List<Payment> payments = paymentService.getUserPayments(user);
//        return ResponseEntity.ok(payments);
//    }
//
//    @PostMapping("/callback")
//    public ResponseEntity<Map<String, String>> handlePaymentCallback(@RequestBody Map<String, Object> callback) {
//        // Traitement des callbacks des opérateurs mobile money
//        String transactionId = (String) callback.get("transactionId");
//        String status = (String) callback.get("status");
//        String externalRef = (String) callback.get("externalReference");
//
//        Payment.PaymentStatus paymentStatus;
//        try {
//            paymentStatus = Payment.PaymentStatus.valueOf(status.toUpperCase());
//        } catch (IllegalArgumentException e) {
//            paymentStatus = Payment.PaymentStatus.FAILED;
//        }
//
//        paymentService.updatePaymentStatus(transactionId, paymentStatus, externalRef, null);
//
//        return ResponseEntity.ok(Map.of("status", "received"));
//    }
//
//    private User getCurrentUser(String token) {
//        // Extraction du token JWT et récupération de l'utilisateur
//        // Pour la démo, on utilise un utilisateur par défaut
//        return userService.getUserByEmail("user@example.com")
//                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
//    }
//}
