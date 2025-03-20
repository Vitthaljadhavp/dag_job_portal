package com.joble.joble.service;

import com.joble.joble.dto.RegisterRequest;
import com.joble.joble.model.User;
import com.joble.joble.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : "JOB_SEEKER");
        user.setMobileNo(registerRequest.getMobileNo());
        user.setWorkStatus(registerRequest.getWorkStatus());

        return userRepository.save(user);
    }

    // ✅ Save reset token
    public void saveResetToken(User user, String token) {
        // ❌ Remove any previously generated token before setting a new one
        user.setResetToken(null);
        user.setTokenExpiry(null);
        userRepository.save(user);  // ✅ First, save the user without the old token
    
        // ✅ Now, assign the new token
        user.setResetToken(token);
        user.setTokenExpiry(new Date(System.currentTimeMillis() + 15 * 60 * 1000)); // 15 min expiry
        userRepository.save(user);
    }
    

    // ✅ Find user by reset token (Ensures only one user is returned)
    public Optional<User> findUserByResetToken(String resetToken) {
        return userRepository.findFirstByResetToken(resetToken);
    }

    // ✅ Update user password
    public void updatePassword(User user, String newPassword) {
        String hashedPassword = passwordEncoder.encode(newPassword);
        System.out.println("New hashed password: " + hashedPassword); // Debugging log
        user.setPassword(hashedPassword);
        user.setResetToken(null);
        user.setTokenExpiry(null);
        userRepository.save(user);
    }

    public void updateProfileCompletionStatus(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfileComplete(true);
        userRepository.save(user);
    }
}
