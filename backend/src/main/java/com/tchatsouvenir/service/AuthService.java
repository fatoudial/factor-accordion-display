
package com.tchatsouvenir.service;

import com.tchatsouvenir.dto.AuthResponse;
import com.tchatsouvenir.dto.LoginRequest;
import com.tchatsouvenir.dto.RegisterRequest;
import com.tchatsouvenir.dto.UpdatePasswordRequest;
import com.tchatsouvenir.dto.UpdateProfileRequest;
import com.tchatsouvenir.model.User;
import com.tchatsouvenir.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private  EmailService emailService;

    public AuthResponse signin(LoginRequest request) {
        // Compte test spécial
        if ("mbodjfaticha99@gmail.com".equals(request.getEmail()) && "passer".equals(request.getPassword())) {
            User testUser = userService.getUserByEmail(request.getEmail())
                    .orElseGet(() -> createTestUser());

            UserDetails userDetails = userService.loadUserByUsername(testUser.getEmail());
            String jwtToken = jwtService.generateToken(userDetails);

            return AuthResponse.builder()
                    .token(jwtToken)
                    .user(AuthResponse.UserInfo.builder()
                            .id(testUser.getId().toString())
                            .email(testUser.getEmail())
                            .firstName(testUser.getName().split(" ")[0])
                            .lastName(testUser.getName().contains(" ") ? testUser.getName().split(" ")[1] : "")
                            .role(testUser.getRole().toString())
                            .build())
                    .build();
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userService.getUserByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        UserDetails userDetails = userService.loadUserByUsername(user.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);

        user.setLastLogin(LocalDateTime.now());
        userService.updateUser(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId().toString())
                        .email(user.getEmail())
                        .firstName(user.getName().split(" ")[0])
                        .lastName(user.getName().contains(" ") ? user.getName().split(" ")[1] : "")
                        .role(user.getRole().toString())
                        .build())
                .build();
    }

    public AuthResponse signup(RegisterRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getFirstName() + " " + request.getLastName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userService.createUser(user);
        UserDetails userDetails = userService.loadUserByUsername(savedUser.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .user(AuthResponse.UserInfo.builder()
                        .id(savedUser.getId().toString())
                        .email(savedUser.getEmail())
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .role(savedUser.getRole().toString())
                        .build())
                .build();
    }

    public void forgotPassword(String email) {
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(24));
        userService.updateUser(user);

        emailService.sendPasswordResetEmail(email, resetToken);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userService.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Token invalide"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expiré");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userService.updateUser(user);
    }

    public AuthResponse.UserInfo verifyToken(String token) {
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return AuthResponse.UserInfo.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .firstName(user.getName().split(" ")[0])
                .lastName(user.getName().contains(" ") ? user.getName().split(" ")[1] : "")
                .role(user.getRole().toString())
                .build();
    }

    public AuthResponse.UserInfo updatePassword(String token, String currentPassword, String newPassword) {
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier l'ancien mot de passe
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Mot de passe actuel incorrect");
        }

        // Mettre à jour le mot de passe
        user.setPassword(passwordEncoder.encode(newPassword));
        userService.updateUser(user);

        return AuthResponse.UserInfo.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .firstName(user.getName().split(" ")[0])
                .lastName(user.getName().contains(" ") ? user.getName().split(" ")[1] : "")
                .role(user.getRole().toString())
                .build();
    }

    public AuthResponse.UserInfo updateProfile(String token, UpdateProfileRequest request) {
        String email = jwtService.extractUsername(token);
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Mettre à jour les informations
        if (request.getFirstName() != null && request.getLastName() != null) {
            user.setName(request.getFirstName() + " " + request.getLastName());
        }
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            // Vérifier si l'email n'est pas déjà utilisé
            if (userService.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email déjà utilisé par un autre utilisateur");
            }
            user.setEmail(request.getEmail());
        }

        userService.updateUser(user);

        return AuthResponse.UserInfo.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .firstName(request.getFirstName() != null ? request.getFirstName() : user.getName().split(" ")[0])
                .lastName(request.getLastName() != null ? request.getLastName() : (user.getName().contains(" ") ? user.getName().split(" ")[1] : ""))
                .role(user.getRole().toString())
                .build();
    }

    private User createTestUser() {
        User testUser = new User();
        testUser.setEmail("mbodjfaticha99@gmail.com");
        testUser.setName("Faticha Mbodj");
        testUser.setPassword(passwordEncoder.encode("passer"));
        testUser.setRole(Role.USER);
        testUser.setIsActive(true);
        testUser.setCreatedAt(LocalDateTime.now());
        return userService.createUser(testUser);
    }
}
