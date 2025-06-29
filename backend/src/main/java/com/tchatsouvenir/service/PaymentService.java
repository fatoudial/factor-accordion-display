
package com.tchatsouvenir.service;

import com.tchatsouvenir.model.Payment;
import com.tchatsouvenir.model.Order;
import com.tchatsouvenir.model.User;
import com.tchatsouvenir.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;

    public Payment createPayment(User user, Order order, BigDecimal amount, 
                                String paymentMethod, String provider, String phoneNumber) {
        Payment payment = new Payment();
        payment.setTransactionId(generateTransactionId());
        payment.setUser(user);
        payment.setOrder(order);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setProvider(provider);
        payment.setPhoneNumber(phoneNumber);
        payment.setStatus(Payment.PaymentStatus.PENDING);
        
        return paymentRepository.save(payment);
    }

    public Payment updatePaymentStatus(String transactionId, Payment.PaymentStatus status, 
                                     String externalReference, String failureReason) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
            .orElseThrow(() -> new RuntimeException("Paiement non trouvé: " + transactionId));
        
        payment.setStatus(status);
        payment.setExternalReference(externalReference);
        payment.setFailureReason(failureReason);
        
        if (status == Payment.PaymentStatus.SUCCESS) {
            payment.setCompletedAt(LocalDateTime.now());
        }
        
        return paymentRepository.save(payment);
    }

    public Optional<Payment> getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }

    public List<Payment> getUserPayments(User user) {
        return paymentRepository.findByUser(user);
    }

    public List<Payment> getPaymentsByStatus(Payment.PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }

    // Simulation du processus de paiement mobile money
    public Payment processMobileMoneyPayment(Payment payment) {
        // Ici vous intégreriez avec les APIs des opérateurs
        // Pour la démo, on simule un succès après un délai
        
        try {
            // Simulation d'appel API vers Orange Money, Wave, etc.
            Thread.sleep(2000); // Simulation délai réseau
            
            // 90% de succès pour la démo
            boolean success = Math.random() > 0.1;
            
            if (success) {
                payment.setStatus(Payment.PaymentStatus.SUCCESS);
                payment.setExternalReference("EXT-" + System.currentTimeMillis());
                payment.setCompletedAt(LocalDateTime.now());
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setFailureReason("Échec de la transaction mobile money");
            }
            
        } catch (InterruptedException e) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setFailureReason("Erreur technique");
        }
        
        return paymentRepository.save(payment);
    }

    private String generateTransactionId() {
        return "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
    }
}
