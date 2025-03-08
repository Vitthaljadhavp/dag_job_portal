package com.joble.joble.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.joble.joble.model.User;
import com.joble.joble.dto.RegisterRequest;
import com.joble.joble.dto.UserResponse;
import com.joble.joble.dto.LoginRequest;
import com.joble.joble.security.JwtTokenProvider;
import com.joble.joble.service.UserService;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
    if (userService.findUserByEmail(registerRequest.getEmail()).isPresent()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already taken.");
    }

    User savedUser = userService.registerUser(registerRequest);

    String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole());

    UserResponse userResponse = new UserResponse(
        savedUser.getId(),
        savedUser.getName(),
        savedUser.getEmail(),
        savedUser.getMobileNo(),
        savedUser.getWorkStatus(),
        savedUser.getRole(),
        token
    );

    return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
}


@PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
    Optional<User> userOpt = userService.findUserByEmail(loginRequest.getEmail());

    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

    User user = userOpt.get();  // Use 'user' instead of 'savedUser'
    
    if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

    String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());

    UserResponse userResponse = new UserResponse(
        user.getId(),   // Use 'user' instead of 'savedUser'
        user.getName(),
        user.getEmail(),
        user.getMobileNo(),
        user.getWorkStatus(),
        user.getRole(),
        token
    );

    System.out.println("Login Successful: " + userResponse);

    return ResponseEntity.ok(userResponse);
}

}
