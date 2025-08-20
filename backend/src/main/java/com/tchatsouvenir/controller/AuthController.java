
package com.tchatsouvenir.controller;

import com.tchatsouvenir.dto.AuthResponse;
import com.tchatsouvenir.dto.LoginRequest;
import com.tchatsouvenir.dto.RegisterRequest;
import com.tchatsouvenir.dto.ForgotPasswordRequest;
import com.tchatsouvenir.dto.ResetPasswordRequest;
import com.tchatsouvenir.dto.UpdatePasswordRequest;
import com.tchatsouvenir.dto.UpdateProfileRequest;
import com.tchatsouvenir.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.signin(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        // Pour JWT, pas besoin de logique côté serveur pour logout
        // Le frontend supprime simplement le token
        return ResponseEntity.ok("Déconnexion réussie");
    }

    @PutMapping("/update-password")
    public ResponseEntity<AuthResponse.UserInfo> updatePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody UpdatePasswordRequest request) {
        String jwt = token.substring(7); // Remove "Bearer "
        AuthResponse.UserInfo userInfo = authService.updatePassword(jwt, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(userInfo);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<AuthResponse.UserInfo> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody UpdateProfileRequest request) {
        String jwt = token.substring(7); // Remove "Bearer "
        AuthResponse.UserInfo userInfo = authService.updateProfile(jwt, request);
        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("Email de réinitialisation envoyé");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Mot de passe réinitialisé avec succès");
    }

    @GetMapping("/verify")
    public ResponseEntity<AuthResponse.UserInfo> verifyToken(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7); // Remove "Bearer "
        AuthResponse.UserInfo userInfo = authService.verifyToken(jwt);
        return ResponseEntity.ok(userInfo);
    }
}
