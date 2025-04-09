package com.joble.joble.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.joble.joble.model.AppliedJobs;
import com.joble.joble.model.Job;
import com.joble.joble.model.User;
import com.joble.joble.repository.AppliedJobsRepo;

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

    public AppliedJobs applyForJob(Long userId, Long jobId) {
        User user = userService.findUserById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Job job = jobService.getJobById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));

        if (appliedJobsRepo.existsByUserAndJob(user, job)) {
            throw new RuntimeException("User has already applied for this job");
        }

        AppliedJobs application = new AppliedJobs(user, job);
        return appliedJobsRepo.save(application);
    }

    public List<AppliedJobs> getUserApplications(Long userId) {
        User user = userService.findUserById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return appliedJobsRepo.findByUser(user);
    }

    public List<AppliedJobs> getJobApplications(Long jobId) {
        Job job = jobService.getJobById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));
        return appliedJobsRepo.findByJob(job);
    }
}
