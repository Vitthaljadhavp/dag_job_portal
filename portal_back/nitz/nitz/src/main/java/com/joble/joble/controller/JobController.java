package com.joble.joble.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.joble.joble.model.Job;
import com.joble.joble.service.JobService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000") // Adjust if needed
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping
public ResponseEntity<Job> postJob(@RequestBody Job job, @RequestHeader("Authorization") String token) {
    System.out.println("JWT Token Received: " + token); // Debugging line

    if (token == null || !token.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    if (job.getEmployer() == null || job.getEmployer().getId() == null) {
        return ResponseEntity.badRequest().body(null);
    }
    
    return ResponseEntity.ok(jobService.postJob(job));
}


    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
    return ResponseEntity.ok(jobService.getAllJobs());
}



    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<Job>> getJobsByEmployer(@PathVariable Long employerId) {
        return ResponseEntity.ok(jobService.getJobsByEmployer(employerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        Optional<Job> job = jobService.getJobById(id);
        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job updatedJob) {
        return ResponseEntity.ok(jobService.updateJob(id, updatedJob));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok("Job deleted successfully");
    }
}