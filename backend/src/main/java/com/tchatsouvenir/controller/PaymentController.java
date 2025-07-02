package com.tchatsouvenir.controller;

import com.tchatsouvenir.model.Payment;
import com.tchatsouvenir.model.Order;
import com.tchatsouvenir.model.User;
import com.tchatsouvenir.service.PaymentService;
import com.tchatsouvenir.service.OrderService;
import com.tchatsouvenir.service.UserService;
import com.tchatsouvenir.service.OrangeMoneyService;
import com.tchatsouvenir.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
@Tag(name = "Payments", description = "API de gestion des paiements")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrangeMoneyService orangeMoneyService;

    @Autowired
    private JwtService jwtService;
    @PostMapping("/initiate")
    @Operation(summary = "Initier un paiement", description = "Initie un nouveau paiement")
    public ResponseEntity<Map<String, Object>> initiatePayment(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {

        User user = getCurrentUser(token);

        Long orderId = Long.valueOf(request.get("orderId").toString());
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        String paymentMethod = (String) request.get("method");
        String provider = (String) request.get("provider");
        String phoneNumber = (String) request.get("phoneNumber");

        Order order = orderService.getOrderById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));

        Payment payment = paymentService.createPayment(user, order, amount, paymentMethod, provider, phoneNumber);

        Map<String, Object> response = new HashMap<>();
        
        // Traitement selon le type de paiement
        if ("mobile_money".equals(paymentMethod)) {
            if ("orange_money".equals(provider)) {
                Map<String, Object> orangeResponse = orangeMoneyService.initiatePayment(
                    phoneNumber, amount, orderId.toString());
                response.putAll(orangeResponse);
            } else {
                // Pour les autres opérateurs (Wave, MTN, etc.)
                new Thread(() -> paymentService.processMobileMoneyPayment(payment)).start();
                response.put("success", true);
                response.put("message", "Paiement mobile money initié");
            }
        } else if ("card".equals(paymentMethod)) {
            // Simulation processus carte bancaire
            response.put("success", true);
            response.put("payment_url", "https://secure-payment.bank.com/pay?session=" + payment.getTransactionId());
            response.put("message", "Redirection vers le portail de paiement sécurisé");
        } else if ("paypal".equals(paymentMethod)) {
            // Simulation processus PayPal
            response.put("success", true);
            response.put("payment_url", "https://www.paypal.com/checkoutnow?token=" + payment.getTransactionId());
            response.put("message", "Redirection vers PayPal");
        }

        response.put("transactionId", payment.getTransactionId());
        response.put("status", payment.getStatus().toString());

        return ResponseEntity.ok(response);
    }
    @GetMapping("/status/{transactionId}")
    @Operation(summary = "Vérifier le statut d'un paiement")
    public ResponseEntity<Map<String, Object>> checkPaymentStatus(@PathVariable String transactionId) {
        Optional<Payment> paymentOpt = paymentService.getPaymentByTransactionId(transactionId);

        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("transactionId", payment.getTransactionId());
            response.put("status", payment.getStatus().toString());
            response.put("amount", payment.getAmount());
            response.put("method", payment.getPaymentMethod());
            response.put("completedAt", payment.getCompletedAt());
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Transaction non trouvée");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    @GetMapping("/history")
    @Operation(summary = "Historique des paiements de l'utilisateur")
    public ResponseEntity<List<Payment>> getPaymentHistory(@RequestHeader("Authorization") String token) {
        User user = getCurrentUser(token);
        List<Payment> payments = paymentService.getUserPayments(user);
        return ResponseEntity.ok(payments);
    }
    @PostMapping("/callback")
    @Operation(summary = "Callback des opérateurs de paiement")
    public ResponseEntity<Map<String, String>> handlePaymentCallback(@RequestBody Map<String, Object> callback) {
        // Traitement des callbacks des opérateurs mobile money
        String transactionId = (String) callback.get("transactionId");
        String status = (String) callback.get("status");
        String externalRef = (String) callback.get("externalReference");

        Payment.PaymentStatus paymentStatus;
        try {
            paymentStatus = Payment.PaymentStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            paymentStatus = Payment.PaymentStatus.FAILED;
        }

        paymentService.updatePaymentStatus(transactionId, paymentStatus, externalRef, null);

        Map<String, String> response = new HashMap<>();
        response.put("status", "received");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/orange-money/initiate")
    @Operation(summary = "Paiement Orange Money spécifique")
    public ResponseEntity<Map<String, Object>> initiateOrangeMoneyPayment(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {
        
        User user = getCurrentUser(token);
        
        String phoneNumber = (String) request.get("phoneNumber");
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        String orderId = request.get("orderId").toString();
        
        Map<String, Object> response = orangeMoneyService.initiatePayment(phoneNumber, amount, orderId);
        
        return ResponseEntity.ok(response);
    }
    private User getCurrentUser(String token) {
        try {
            // Extraire le token JWT (enlever "Bearer ")
            String jwt = token.substring(7);
            String email = jwtService.extractUsername(jwt);
            
            return userService.getUserByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        } catch (Exception e) {
            throw new RuntimeException("Token invalide: " + e.getMessage());
        }
    }
}
