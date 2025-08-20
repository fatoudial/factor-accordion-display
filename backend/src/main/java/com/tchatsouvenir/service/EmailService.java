
package com.tchatsouvenir.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendEmail(String to, String subject, String content) {
        // Logique d'envoi d'email (à implémenter ou simuler pour l'instant)
        System.out.println("Envoi d'email à " + to + " avec sujet : " + subject);
        System.out.println("Contenu : " + content);
    }

    public void sendPasswordResetEmail(String email, String resetToken) {
        String subject = "Réinitialisation de votre mot de passe";
        String content = "Cliquez sur ce lien pour réinitialiser votre mot de passe : " +
                "http://localhost:5173/reset-password?token=" + resetToken +
                "\n\nCe lien expire dans 24 heures.";

        sendEmail(email, subject, content);
    }
}
