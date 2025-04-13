package com.joble.joble.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.joble.joble.model.AppliedJobs;
import com.joble.joble.service.AppliedJobsService;

@RestController
@RequestMapping("/api/applied-jobs")
@CrossOrigin("http://localhost:3000")
public class AppliedJobsController {
    
    private final AppliedJobsService appliedJobsService;

    @Autowired
    public AppliedJobsController(AppliedJobsService appliedJobsService) {
        this.appliedJobsService = appliedJobsService;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestParam Long userId, @RequestParam Long jobId) {
        try {
            AppliedJobs application = appliedJobsService.applyForJob(userId, jobId);
            return ResponseEntity.ok("Successfully applied for the job");
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            } else if (e.getMessage().contains("already applied")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error applying for job: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserApplications(@PathVariable Long userId) {
        try {
            List<AppliedJobs> applications = appliedJobsService.getUserApplications(userId);
            return ResponseEntity.ok(applications);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching applications: " + e.getMessage());
        }
    }


    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getJobApplications(@PathVariable Long jobId) {
        try {
            List<AppliedJobs> applications = appliedJobsService.getJobApplications(jobId);
            return ResponseEntity.ok(applications);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching applications: " + e.getMessage());
        }
    }
}
