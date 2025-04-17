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

import jakarta.servlet.http.HttpServletRequest;
import java.util.* ;

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
    if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

    String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());
    boolean isProfileComplete = user.isProfileComplete();

    return ResponseEntity.ok(Map.of(
            "userId", user.getId(),  // Include userId in response
            "token", token,
            "role", user.getRole(),
            "isProfileComplete", isProfileComplete
    ));
}


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email, HttpServletRequest request) {
        try {
            Optional<User> userOpt = userService.findUserByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            User user = userOpt.get();
            String resetToken = UUID.randomUUID().toString();
            userService.saveResetToken(user, resetToken);
            
            String frontendUrl = request.getHeader("Origin");  
            if (frontendUrl == null || frontendUrl.isEmpty()) {
                frontendUrl = "http://localhost";  
            }
            
            emailService.sendResetEmail(user.getEmail(), resetToken, frontendUrl);
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

    @PutMapping("/update-profile-status/{userId}")
    public ResponseEntity<?> updateProfileStatus(@PathVariable Long userId) {
        try {
            userService.updateProfileCompletionStatus(userId);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating profile: " + e.getMessage());
        }
    }

    @GetMapping("/job_seekers")
public ResponseEntity<?> getJobSeekers() {
    try {
        List<User> jobSeekers = userService.findUsersByRole("job_seeker");
        List<User> recruiters = userService.findUsersByRole("recruiter");

        if (jobSeekers.isEmpty() && recruiters.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No users found");
        }

        Map<String, List<User>> response = new HashMap<>();
        response.put("jobSeekers", jobSeekers);
        response.put("recruiters", recruiters);

        return ResponseEntity.ok(response);

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching users: " + e.getMessage());
    }
}


}
