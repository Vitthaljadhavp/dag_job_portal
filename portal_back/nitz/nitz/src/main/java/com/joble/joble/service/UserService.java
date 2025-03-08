package com.joble.joble.service;

import com.joble.joble.dto.RegisterRequest;
import com.joble.joble.model.User;
import com.joble.joble.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
    
        // No need to check confirmPassword since it's not in the frontend
    
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword())); // Hash password
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : "JOB_SEEKER");
        user.setMobileNo(registerRequest.getMobileNo());
        user.setWorkStatus(registerRequest.getWorkStatus());
    
        return userRepository.save(user);
    }
    
    
}
