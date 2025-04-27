package com.joble.joble.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joble.joble.model.Job;
import com.joble.joble.repository.JobRepository;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public Job postJob(Job job) {
        return jobRepository.save(job);
    }

    // Method to fetch all jobs
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // public List<Job> getJobsByEmployer(Long employerId) {
    //     return jobRepository.findByEmployerId(employerId);
    // }

    public Optional<Job> findJobById(Long jobId) {
        return jobRepository.findById(jobId);
    }
    

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public Job updateJob(Long id, Job updatedJob) {
        return jobRepository.findById(id).map(job -> {
            job.setTitle(updatedJob.getTitle());
            job.setCompany(updatedJob.getCompany());
            job.setLocation(updatedJob.getLocation());
            job.setSalary(updatedJob.getSalary());
            job.setStatus(updatedJob.getStatus());
            return jobRepository.save(job);
        }).orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    
}