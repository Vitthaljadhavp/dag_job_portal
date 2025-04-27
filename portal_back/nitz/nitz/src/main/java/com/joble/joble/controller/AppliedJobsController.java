package com.joble.joble.controller;

import com.joble.joble.model.AppliedJobs;
import com.joble.joble.model.Job;
import com.joble.joble.model.User;
import com.joble.joble.repository.AppliedJobsRepo;
import com.joble.joble.repository.JobRepository;
import com.joble.joble.repository.UserRepository;
import com.joble.joble.service.AppliedJobsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applied-jobs")
@CrossOrigin("http://localhost:3000")
public class AppliedJobsController {

    private final AppliedJobsService appliedJobsService;
    private final AppliedJobsRepo appliedJobsRepo;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    @Autowired
    public AppliedJobsController(AppliedJobsService appliedJobsService, 
                                 AppliedJobsRepo appliedJobsRepo, 
                                 UserRepository userRepository,
                                 JobRepository jobRepository) {
        this.appliedJobsService = appliedJobsService;
        this.appliedJobsRepo = appliedJobsRepo;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }

    // Apply for a job
    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> applyToJob(@PathVariable Long jobId, Principal principal) {
        // principal.getName() = currently logged-in user's email
        User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found"));

        // Check if already applied
        boolean alreadyApplied = appliedJobsRepo.existsByUserIdAndJobId(user.getId(), job.getId());
        if (alreadyApplied) {
            return ResponseEntity.badRequest().body("Already applied to this job!");
        }

        AppliedJobs appliedJob = new AppliedJobs();
        appliedJob.setUser(user);
        appliedJob.setJob(job);
        appliedJob.setStatus("PENDING"); // New application always starts with PENDING

        appliedJobsRepo.save(appliedJob);

        return ResponseEntity.ok("Job applied successfully!");
    }

    @GetMapping("/{userId}/applied")
public ResponseEntity<List<AppliedJobs>> getAppliedJobsByUserId(@PathVariable Long userId) {
    List<AppliedJobs> appliedJobs = appliedJobsService.getAppliedJobsByUserId(userId);
    if (appliedJobs.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    return new ResponseEntity<>(appliedJobs, HttpStatus.OK);
}





    

    // Get applied jobs by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AppliedJobs>> getUserApplications(@PathVariable Long userId) {
        List<AppliedJobs> applications = appliedJobsService.getUserApplications(userId);
        return ResponseEntity.ok(applications);
    }

    // Get applicants for a job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<AppliedJobs>> getJobApplications(@PathVariable Long jobId) {
        List<AppliedJobs> applications = appliedJobsService.getJobApplications(jobId);
        return ResponseEntity.ok(applications);
    }
}
