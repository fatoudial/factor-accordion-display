//
//package com.tchatsouvenir.controller;
//
//import com.tchatsouvenir.dto.AuthResponse;
//import com.tchatsouvenir.dto.LoginRequest;
//import com.tchatsouvenir.dto.RegisterRequest;
//import com.tchatsouvenir.dto.ForgotPasswordRequest;
//import com.tchatsouvenir.dto.ResetPasswordRequest;
//import com.tchatsouvenir.service.AuthService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/auth")
//@CrossOrigin(origins = "*")
//public class AuthController {
//
//    @Autowired
//    private AuthService authService;
//
//    @PostMapping("/signin")
//    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest request) {
//        AuthResponse response = authService.signin(request);
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/signup")
//    public ResponseEntity<AuthResponse> signup(@RequestBody RegisterRequest request) {
//        AuthResponse response = authService.signup(request);
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/forgot-password")
//    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
//        authService.forgotPassword(request.getEmail());
//        return ResponseEntity.ok("Email de réinitialisation envoyé");
//    }
//
//    @PostMapping("/reset-password")
//    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
//        authService.resetPassword(request.getToken(), request.getNewPassword());
//        return ResponseEntity.ok("Mot de passe réinitialisé avec succès");
//    }
//
//    @GetMapping("/verify")
//    public ResponseEntity<AuthResponse.UserInfo> verifyToken(@RequestHeader("Authorization") String token) {
//        String jwt = token.substring(7); // Remove "Bearer "
//        AuthResponse.UserInfo userInfo = authService.verifyToken(jwt);
//        return ResponseEntity.ok(userInfo);
//    }
//}
