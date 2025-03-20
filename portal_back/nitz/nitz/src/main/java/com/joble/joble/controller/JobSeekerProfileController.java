package com.joble.joble.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.joble.joble.model.JobSeekerProfile;
import com.joble.joble.security.JwtTokenProvider;
import com.joble.joble.service.JobSeekerProfileService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/job-seeker")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class JobSeekerProfileController {

    private final JobSeekerProfileService profileService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public JobSeekerProfileController(JobSeekerProfileService profileService) {
        this.profileService = profileService;
    }

    // Create or update job seeker profile
    @PostMapping(value = "/save", consumes = {"multipart/form-data"})
public ResponseEntity<?> saveProfile(
        @RequestPart("profile") JobSeekerProfile profile,
        @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
        @RequestPart(value = "resume", required = false) MultipartFile resume,
        @RequestHeader("Authorization") String authHeader // ✅ Ensure token is received
) {
    try {
        // ✅ Ensure token is present in the Authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7); // Remove 'Bearer ' prefix
        String username = jwtTokenProvider.extractUsername(token); // ✅ Extract username from token

        if (username == null || username.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        // ✅ Save job seeker profile
        JobSeekerProfile savedProfile = profileService.saveProfile(profile, profilePicture, resume);
        
        return ResponseEntity.ok(savedProfile);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error saving profile: " + e.getMessage());
    }
}

    // Get all profiles
    @GetMapping("/all")
    public ResponseEntity<List<JobSeekerProfile>> getAllProfiles() {
        return ResponseEntity.ok(profileService.getAllProfiles());
    }

    // Get profile by ID
    @GetMapping("/{id}")
    public ResponseEntity<JobSeekerProfile> getProfileById(@PathVariable Long id) {
        Optional<JobSeekerProfile> profile = profileService.getProfileById(id);
        return profile.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete profile
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {
        profileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }
}
