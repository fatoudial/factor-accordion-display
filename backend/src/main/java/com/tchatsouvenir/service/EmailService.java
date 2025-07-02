package com.tchatsouvenir.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    public void sendEmail(String to, String subject, String content) {
        // Logique d’envoi d’email (à implémenter ou simuler pour l’instant)
        System.out.println("Envoi d'email à " + to + " avec sujet : " + subject);
    }
}
