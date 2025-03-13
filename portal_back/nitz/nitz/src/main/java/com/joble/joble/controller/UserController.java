package com.joble.joble.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.joble.joble.model.User;
import com.joble.joble.dto.RegisterRequest;
import com.joble.joble.dto.UserResponse;
import com.joble.joble.dto.LoginRequest;
import com.joble.joble.service.UserService;
import com.joble.joble.service.EmailService;
import com.joble.joble.security.JwtTokenProvider;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            if (userService.findUserByEmail(registerRequest.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already taken.");
            }
            User savedUser = userService.registerUser(registerRequest);
            String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole());
            UserResponse userResponse = new UserResponse(
                    savedUser.getId(), savedUser.getName(), savedUser.getEmail(),
                    savedUser.getMobileNo(), savedUser.getWorkStatus(), savedUser.getRole(), token
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
    Optional<User> userOpt = userService.findUserByEmail(loginRequest.getEmail());
    
    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

    User user = userOpt.get();
    System.out.println("Stored Hashed Password: " + user.getPassword());
    System.out.println("Entered Password: " + loginRequest.getPassword());
    System.out.println("Password Match Result: " + passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()));

    if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

    String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());
    UserResponse userResponse = new UserResponse(
            user.getId(), user.getName(), user.getEmail(),
            user.getMobileNo(), user.getWorkStatus(), user.getRole(), token
    );
    return ResponseEntity.ok(userResponse);
}



    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            Optional<User> userOpt = userService.findUserByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            User user = userOpt.get();
            String resetToken = UUID.randomUUID().toString();
            userService.saveResetToken(user, resetToken);
            emailService.sendResetEmail(user.getEmail(), resetToken);
            return ResponseEntity.ok("Password reset link sent to email");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing forgot password request: " + e.getMessage());
        }
    }

    @PutMapping("/reset-password")
public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
    try {
        String token = request.get("token");
        String newPassword = request.get("password");

        Optional<User> userOpt = userService.findUserByResetToken(token);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }

        userService.updatePassword(userOpt.get(), newPassword);
        return ResponseEntity.ok("Password successfully updated");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error resetting password: " + e.getMessage());
    }
}

}
