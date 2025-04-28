package com.joble.joble.service;

import com.joble.joble.model.AppliedJobs;
import com.joble.joble.model.User;
import com.joble.joble.model.Job;
import com.joble.joble.repository.AppliedJobsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppliedJobsService {

    private final AppliedJobsRepo appliedJobsRepo;
    private final UserService userService;
    private final JobService jobService;

    @Autowired
    public AppliedJobsService(AppliedJobsRepo appliedJobsRepo, UserService userService, JobService jobService) {
        this.appliedJobsRepo = appliedJobsRepo;
        this.userService = userService;
        this.jobService = jobService;
    }

    // Apply for a job
    public AppliedJobs applyForJob(Long userId, Long jobId) {
        User user = userService.findUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Job job = jobService.findJobById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Check if the user has already applied for this job
        if (appliedJobsRepo.existsByUserAndJob(user, job)) {
            throw new RuntimeException("You have already applied for this job");
        }

        // Create and save the application
        AppliedJobs application = new AppliedJobs(user, job);
        return appliedJobsRepo.save(application);
    }

    // Get all jobs applied by a user
    public List<AppliedJobs> getUserApplications(Long userId) {
        User user = userService.findUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return appliedJobsRepo.findByUser(user);
    }

    // Get all applicants for a job
    public List<AppliedJobs> getJobApplications(Long jobId) {
        Job job = jobService.findJobById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return appliedJobsRepo.findByJob(job);
    }

    public List<AppliedJobs> getApplications(Long jobId) {
        return appliedJobsRepo.findByJobId(jobId);
    }

    public List<AppliedJobs> getAppliedJobsByUserId(Long userId) {
        return appliedJobsRepo.findByUserId(userId); // Assuming you have a method to fetch jobs by userId
    }

    public List<AppliedJobs> getAllAppliedJobs() {
        return appliedJobsRepo.findAll();
    }
}
